import mongoose from "mongoose";
import { Chat } from '../../Models/Chat Models/Chat.model.js';
import { Shops } from "../../Models/Admin Models/Admin.model.js";
import { User } from "../../Models/User Models/user.model.js";
import { fileUploadOnCloudinary } from "../../utils/fileUploadAndRemoveFromCloudinary.js"

// user create chat
const userCreateChat = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ status: 400, message: "User not found" });
        }
        const { sellerId } = req.body;
        if (!sellerId) {
            return res.status(400).json({ status: 400, message: "Seller ID is required" });
        }

        const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
        let chat = await Chat.findOne({ "user.id": userId, "seller.id": sellerObjectId });
        if (chat) {
            return res.status(200).json({ status: 200, message: "Chat already exists", data: chat });
        }

        // fetch user and seller 
        const [user, seller] = await Promise.all([
            User.findById(userId).select("-password -refreshToken"),
            Shops.findById(sellerId).select("-password -refreshToken -Orders -personalInfo -phoneNumber")
        ]);

        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        if (!seller) {
            return res.status(404).json({ status: 404, message: "Seller not found" });
        }

        chat = new Chat({
            user: {
                id: user._id,
                name: user.fullName,
                avatar: user.avatar?.url || "",
            },
            seller: {
                id: seller._id,
                name: seller.shopName,
                avatar: seller.shopLogo?.url || "",
            },
            messages: [],
        });

        await chat.save();

        return res.status(200).json({ status: 200, message: "Chat created successfully", data: chat });
    } catch (error) {
        return res.status(500).json({ status: 500, message: `Error creating chat: ${error.message}` });
    }
};

// seller create chat
const sellerCreateChat = async (req, res) => {
    try {
        const sellerId = req.admin?._id;
        if (!sellerId) {
            return res.status(400).json({ message: "User did not found" })
        };
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "user id is required" })
        }

        // find chat 
        const userObjectId = new mongoose.Types.ObjectId(userId);
        let chat = await Chat.findOne({ "user.id": userObjectId, "seller.id": sellerId });
        if (chat) {
            return res.status(200).json({ status: 200, message: "Chat already exists", data: chat });
        }
        // fetch user and seller 
        const [user, seller] = await Promise.all([
            User.findById(userId).select("-password -refreshToken"),
            Shops.findById(sellerId).select("-password -refreshToken -Orders -personalInfo -phoneNumber")
        ]);

        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        if (!seller) {
            return res.status(404).json({ status: 404, message: "Seller not found" });
        }

        chat = new Chat({
            user: {
                id: user._id,
                name: user.fullName,
                avatar: user.avatar?.url || "",
            },
            seller: {
                id: seller._id,
                name: seller.shopName,
                avatar: seller.shopLogo?.url || "",
            },
            messages: [],
        });

        return res.status(200).json({ status: 200, message: "chat create successfully", data: chat });
    } catch (error) {
        return res.status(500).json({ message: "Error create chat" + error.message });
    }
}

// send message 
const sendMessage = async (req, res) => {
    try {
        const { chatId, senderId,message} = req.body;
        const images = req.files?.images;

        if (!chatId || !senderId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        let image = null;
        if (images && images.length > 0) {
            const imagePath = images[0].path;
            const folder = "Multi Vendor/Messages";
            const fileUpload = await fileUploadOnCloudinary(imagePath, folder);
            image = { public_Id: fileUpload.public_id, url: fileUpload.url };
        }

        // Push message to chat history
        const newMessage = { sender: senderId, message, ...(image && { image }) };
        chat.messages.push(newMessage);
        await chat.save();

        const savedMessage = chat.messages[chat.messages.length - 1];

        return res.status(200).json({
            status: 200,
            message: "Message sent successfully",
            data: savedMessage,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error sending message: " + error.message });
    }
};

// edit message
const editMessage = async (req, res) => {
    try {
        const { chatId, messageId, message } = req.body;
        if (!messageId || !chatId || !message) {
            return res.status(400).json({ message: "all fields are required" })
        }
        const chat = await Chat.findById({ _id: chatId });
        const messages = chat.messages.id(messageId);
        messages.message = message;
        messages.edited = true;
        await chat.save();
        return res.status(200).json({ status: 200, message: "Message Edit Successfully", data: chat });
    } catch (error) {
        return res.status(500).json({ message: "Error editing message" + error.message });
    }
}

// user get chat
const user_getChats = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User did not found" })
        };
        const chat = await Chat.find({ "user.id": userId });
        return res.status(200).json({ status: 200, message: "user get chat success fully", data: chat });
    } catch (error) {
        res.status(500).json({ message: "Error fetching chat" + error.message });
    }
}

// seller get chat
const seller_getChats = async (req, res) => {
    try {
        const userId = req.admin?._id;
        if (!userId) {
            return res.status(400).json({ message: "User did not found" })
        };
        const chat = await Chat.find({ "seller.id": userId });
        return res.status(200).json({ status: 200, message: "user get chat success fully", data: chat });
    } catch (error) {
        res.status(500).json({ message: "Error fetching chat" + error.message });
    }
}

// delete message
const deleteMessage = async (req, res) => {
    try {
        const { chatId, messageId } = req.body;
        const chat = await Chat.findById({ _id: chatId });
        chat.messages = chat.messages.filter(msg => msg._id.toString() !== messageId);
        await chat.save();
        return res.status(200).json({ status: 200, message: "delete message success fully", data: chat });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting message" + error.message });
    }
}

export { userCreateChat, sellerCreateChat, sendMessage, editMessage, user_getChats, seller_getChats, deleteMessage };
