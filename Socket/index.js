import express from "express"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"

dotenv.config({ path: ".env" })

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Chat server is running!")
})

// Store active users and messages
let users = []
const messages = {} // Stores messages by chatId

// Helper functions
const addUser = (userId, socketId) => {
    if (!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId })
    }
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => users.find((user) => user.userId === userId)

// Create a new message object
const createMessage = ({ chatId, senderId, message, images = [] }) => ({
    chatId,
    senderId,
    message,
    images,
    seen: false,
    timestamp: new Date(),
    id: Date.now().toString(), // Generate a unique ID
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    // Add user when they join
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
        console.log(`User ${userId} added to active users`)
    })

    // Join a specific chat room
    socket.on("joinChat", (chatId) => {
        socket.join(chatId)
        console.log(`Socket ${socket.id} joined chat: ${chatId}`)
    })

    // Leave a specific chat room
    socket.on("leaveChat", (chatId) => {
        socket.leave(chatId)
        console.log(`Socket ${socket.id} left chat: ${chatId}`)
    })

    // Send message with chatId, senderId, text, and images
    socket.on("sendMessage", ({ chatId, senderId, message, images = [] }) => {
        console.log(`Received message from ${senderId} in chat ${chatId}`)

        const createdMessage = createMessage({ chatId, senderId, message, images })

        // Store message in chat history
        if (!messages[chatId]) {
            messages[chatId] = []
        }
        messages[chatId].push(createdMessage)

        // Broadcast to everyone in the chat room
        io.to(chatId).emit("receiveMessage", createdMessage)

        // Update last message for all users
        io.emit("getLastMessage", {
            chatId,
            lastMessage: message,
            lastMessageTime: createdMessage.timestamp,
        })
    })

    // Edit message
    socket.on("editMessage", ({ chatId, messageId, message }) => {
        console.log(`Editing message ${messageId} in chat ${chatId}`)

        if (messages[chatId]) {
            const messageIndex = messages[chatId].findIndex((msg) => msg._id === messageId)
            if (messageIndex !== -1) {
                messages[chatId][messageIndex].message = message
                messages[chatId][messageIndex].edited = true

                // Broadcast to everyone in the chat room
                io.to(chatId).emit("messageEdited", { chatId, messageId, message })
            }
        }
    })

    // Delete message
    socket.on("deleteMessage", ({ chatId, messageId }) => {
        console.log(`Deleting message ${messageId} from chat ${chatId}`)

        if (messages[chatId]) {
            messages[chatId] = messages[chatId].filter((msg) => msg.id !== messageId)

            // Broadcast to everyone in the chat room
            io.to(chatId).emit("messageDeleted", { chatId, messageId })
        }
    })

    // Mark message as seen
    socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
        console.log(`Message ${messageId} marked as seen by ${receiverId}`)

        const sender = getUser(senderId)
        if (messages[receiverId]) {
            const message = messages[receiverId].find((msg) => msg.id === messageId)
            if (message) {
                message.seen = true
                if (sender) {
                    io.to(sender.socketId).emit("messageSeen", { senderId, receiverId, messageId })
                }
            }
        }
    })

    // Typing indicator
    socket.on("typing", ({ chatId, userId, isTyping }) => {
        socket.to(chatId).emit("userTyping", { userId, isTyping })
    })

    // Remove user on disconnect
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`)
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})

// Start server
const PORT = process.env.PORT || 8956
server.listen(PORT, () => {
    console.log(`Chat server running on http://localhost:${PORT}`)
})

