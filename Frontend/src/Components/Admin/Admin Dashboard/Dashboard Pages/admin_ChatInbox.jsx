import React, { useContext, useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { io } from "socket.io-client"
import { ContextApi } from "../../../../Context/Context.jsx"
import { 
  FaArrowLeft, FaPaperPlane, FaCheck, FaTimes, FaEllipsisV, FaBars, 
  FaUser, FaEllipsisH, FaChevronDown, FaPaperclip, FaCheckDouble,
  FaImage, FaSmile, FaMicrophone, FaCamera
} from "react-icons/fa"

// Initialize socket connection with reconnection options
const socket = io("http://localhost:4000", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

const AdminChatInbox = ({ shopId }) => {
  const { chat } = useContext(ContextApi)
  const { sendMessage, editMessage, delMessage, seller_getChats } = chat
  const [contacts, setContacts] = useState([])
  const [userId, setUserId] = useState(null)
  const [message, setMessage] = useState("")
  const [editingMessage, setEditingMessage] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedChat, setSelectedChat] = useState(null)
  const [showDropdown, setShowDropdown] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [typing, setTyping] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  // Fetch chats on component mount
  useEffect(() => {
    const getChats = async () => {
      try {
        setIsLoading(true)
        const data = await seller_getChats(setUserId)
        setContacts(data?.data || [])
        setError(null)
      } catch (error) {
        console.error("Error fetching chats:", error)
        setError("Failed to load conversations. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    getChats()

    // Socket connection status handling
    socket.on("connect", () => console.log("Socket connected"))
    socket.on("disconnect", () => console.log("Socket disconnected"))
    socket.on("connect_error", (err) => console.error("Connection error:", err))

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("connect_error")
    }
  }, [seller_getChats])

  // Handle socket connection for real-time messaging
  useEffect(() => {
    if (!selectedChat) return

    const chatId = selectedChat._id
    
    // Join chat room
    socket.emit("addUser", userId)
    socket.emit("joinChat", chatId)

    // Handle receiving messages
    const handleReceiveMessage = (newMessage) => {
      if (newMessage.chatId === chatId) {
        setSelectedChat((prev) => {
          if (!prev) return null
          return {
            ...prev,
            messages: [...(prev.messages || []), newMessage],
            lastMessage: newMessage.message,
            lastMessageTime: newMessage.timestamp || new Date().toISOString(),
          }
        })
      }
    }

    // Handle message edited
    const handleMessageEdited = ({ chatId: msgChatId, messageId, message }) => {
      if (msgChatId === chatId) {
        setSelectedChat((prev) => {
          if (!prev) return null
          return {
            ...prev,
            messages: prev.messages.map((msg) => 
              msg._id === messageId ? { ...msg, message, edited: true } : msg
            ),
          }
        })
      }
    }

    // Handle message deleted
    const handleMessageDeleted = ({ chatId: msgChatId, messageId }) => {
      if (msgChatId === chatId) {
        setSelectedChat((prev) => {
          if (!prev) return null
          return {
            ...prev,
            messages: prev.messages.filter((msg) => msg._id !== messageId),
          }
        })
      }
    }

    // Register socket event listeners
    socket.on("receiveMessage", handleReceiveMessage)
    socket.on("messageEdited", handleMessageEdited)
    socket.on("messageDeleted", handleMessageDeleted)

    return () => {
      socket.off("receiveMessage", handleReceiveMessage)
      socket.off("messageEdited", handleMessageEdited)
      socket.off("messageDeleted", handleMessageDeleted)
    }
  }, [selectedChat, userId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedChat?.messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus input when editing message
  useEffect(() => {
    if (editingMessage) {
      inputRef.current?.focus()
    }
  }, [editingMessage])

  // Format timestamp to readable time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return ""

    try {
      const date = new Date(timestamp)
      if (isNaN(date.getTime())) return ""

      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return ""
    }
  }

  // Format date for message groups
  const formatMessageDate = (timestamp) => {
    if (!timestamp) return ""

    try {
      const date = new Date(timestamp)
      if (isNaN(date.getTime())) return ""

      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (date.toDateString() === today.toDateString()) {
        return "Today"
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday"
      } else {
        return date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      }
    } catch (error) {
      console.error("Error formatting date:", error)
      return ""
    }
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Preview first image
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(files[0])

    setSelectedImages(files)
  }

  // Cancel image upload
  const cancelImageUpload = () => {
    setSelectedImages([])
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle message submission (new message or edit)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if ((!message.trim() && selectedImages.length === 0) || !selectedChat) return

    try {
      if (editingMessage) {
        const updatedMessage = {
          messageId: editingMessage._id,
          message: message.trim(),
          chatId: selectedChat._id,
        }

        // Optimistic update
        setSelectedChat((prev) => ({
          ...prev,
          messages: prev?.messages.map((msg) =>
            msg._id === editingMessage._id ? { ...msg, message: message.trim(), edited: true } : msg
          ),
        }))

        // Send to server
        const data = await editMessage(updatedMessage);
        socket.emit("editMessage", updatedMessage)
        setEditingMessage(null)
      } else {
        const newMessage = {
          message: message.trim(),
          senderId: userId,
          chatId: selectedChat._id,
          timestamp: new Date().toISOString(),
          images: selectedImages,
        }

        // Send to server
        const response = await sendMessage(newMessage);
        socket.emit("sendMessage", newMessage)

        // Update with server ID if available
        if (response?.data?._id) {
          setSelectedChat((prev) => ({
            ...prev,
            messages: [...prev?.messages || newMessage]
          }))
        }

        // Clear images
        setSelectedImages([])
        setImagePreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }

      setMessage("")
    } catch (error) {
      console.error("Failed to send/edit message:", error)
      // Remove optimistic message on error
      if (!editingMessage) {
        setSelectedChat((prev) => ({
          ...prev,
          messages: prev.messages.filter((msg) => !msg.sending),
        }))
      }
      setError("Failed to send message. Please try again.")
    }
  }

  // Handle message deletion
  const handleDeleteMessage = async (messageId) => {
    if (!selectedChat) return

    try {
      // Optimistic update
      setSelectedChat((prev) => ({
        ...prev,
        messages: prev?.messages.filter((msg) => msg._id !== messageId),
      }))

      // Send to server
      await delMessage({ messageId, chatId: selectedChat._id })
      socket.emit("deleteMessage", { chatId: selectedChat._id, messageId })
      setShowDropdown(null)
    } catch (error) {
      console.error("Failed to delete message:", error)
      // Refresh chat on error
      const data = await seller_getChats(setUserId)
      const refreshedChat = data?.data?.find((chat) => chat._id === selectedChat._id)
      if (refreshedChat) {
        setSelectedChat(refreshedChat)
      }
      setError("Failed to delete message. Please try again.")
    }
  }

  // Handle message actions (edit/delete)
  const handleMessageAction = (action, msg) => {
    if (action === "edit") {
      setEditingMessage(msg)
      setMessage(msg.message)
    } else if (action === "delete") {
      handleDeleteMessage(msg._id)
    }
    setShowDropdown(null)
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-md transform transition-all duration-300 ease-in-out md:relative
          ${isSidebarCollapsed ? "w-20" : "w-80"} 
          ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="p-4 bg-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={`/Shop/${shopId}`} className="p-2 hover:bg-indigo-700 rounded-full transition-colors">
                <FaArrowLeft className="w-5 h-5" />
              </Link>
              {!isSidebarCollapsed && <h1 className="text-xl font-semibold">Customer Messages</h1>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSidebar(false)}
                className="md:hidden p-2 hover:bg-indigo-700 rounded-full transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden md:flex p-2 hover:bg-indigo-700 rounded-full transition-colors"
              >
                <FaChevronDown
                  className={`w-5 h-5 transform transition-transform duration-300 
                    ${isSidebarCollapsed ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {!isSidebarCollapsed && (
          <div className="p-3 bg-white">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="w-full py-2 px-4 pl-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : contacts.length > 0 ? (
            contacts.map((contact) => (
              <div key={contact?._id} onClick={() => {setSelectedChat(contact),setShowSidebar(false)}}
                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors
                  ${selectedChat?._id === contact._id ? "bg-indigo-50" : ""}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                    {contact.user?.avatar ? (
                      <img src={contact.user?.avatar || "/placeholder.svg"} className="w-full h-full object-cover"/>
                    ) : (
                      <FaUser className="w-6 h-6 text-indigo-500" />
                    )}
                  </div>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800 truncate">{contact.user?.name || "Unknown"}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatMessageTime(contact.lastMessageTime) || ""}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{contact.lastMessage || "No messages yet"}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">No conversations yet</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative w-full">
        {/* Overlay for mobile when sidebar is open */}
        {showSidebar && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setShowSidebar(false)} />
        )}

        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 bg-indigo-600 text-white shadow-md">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden p-2 hover:bg-indigo-700 rounded-full transition-colors">
                  <FaBars className="w-5 h-5" />
                </button>
                <button onClick={() => setSelectedChat(null)} className="p-2 hover:bg-indigo-700 rounded-full transition-colors">
                  <FaArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                    {selectedChat.user?.avatar ? (
                      <img src={selectedChat.user?.avatar || "/placeholder.svg"} className="w-full h-full object-cover"/>
                    ) : (
                      <FaUser className="w-5 h-5 text-indigo-500" />
                    )}
                  </div>
                  {selectedChat.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">{selectedChat.user?.name || "Unknown"}</h2>
                  <p className={`text-xs ${selectedChat.online ? "text-indigo-200" : "text-indigo-100"}`}>
                    {selectedChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-indigo-700 rounded-full transition-colors">
                <FaEllipsisV className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" 
              style={{ backgroundImage: "url('https://i.pinimg.com/originals/8f/ba/cb/8fbacbd464e996966eb9d4a6b7a9c21e.jpg')", backgroundSize: "cover" }}
            >
              {selectedChat?.messages && selectedChat?.messages.length > 0 ? (
                selectedChat.messages.map((msg) => (
                  <div key={msg?._id} className="space-y-4">
                    <div className={`flex ${msg?.sender === userId ? "justify-end" : "justify-start"}`}>
                        <div className="group relative max-w-[70%]">
                          {msg?.sender === userId && (
                            <div className="relative" ref={showDropdown === msg?._id ? dropdownRef : null}>
                              <button onClick={() => setShowDropdown(showDropdown === msg?._id ? null : msg?._id)}
                                className="absolute -left-8 top-2 p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaEllipsisH className="w-4 h-4 text-gray-600" />
                              </button>
                              {showDropdown === msg?._id && (
                                <div className="absolute left-0 top-8 w-32 bg-white rounded-lg shadow-lg z-10 py-1 animate-in fade-in duration-200">
                                  <button onClick={() => handleMessageAction("edit", msg)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <span className="text-gray-600">Edit</span>
                                  </button>
                                  <button onClick={() => handleMessageAction("delete", msg)}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                          <div className={`rounded-lg p-3 shadow-sm ${msg?.sender === userId ? "bg-indigo-500 text-white rounded-br-none"
                                : "bg-white text-gray-800 rounded-bl-none"}`}
                          >
                            {msg?.image && (
                              <div className="mb-2 rounded-md overflow-hidden">
                                <img src={msg.image?.url || "/placeholder.svg"} className="max-w-full h-auto object-cover"/>
                              </div>
                            )}
                            {msg?.message && <p className="break-words">{msg?.message}</p>}
                            <div className="flex items-center justify-end gap-1 mt-1">
                              {msg?.edited && (
                                <span
                                  className={`text-xs ${msg?.sender === userId ? "text-indigo-100" : "text-gray-400"}`}
                                >
                                  (edited)
                                </span>
                              )}
                              <p className={`text-xs ${msg?.sender === userId ? "text-indigo-100" : "text-gray-500"}`}>
                                {formatMessageTime(msg?.timestamp)}
                              </p>
                              {msg?.sender === userId && (
                                <span className="ml-1">
                                  {msg.sending ? (
                                    <div className="w-3 h-3 rounded-full border-2 border-indigo-100 border-t-transparent animate-spin"></div>
                                  ) : (
                                    <FaCheckDouble className={`w-4 h-4 text-indigo-100`} />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6 bg-white bg-opacity-80 rounded-xl shadow-sm">
                    <p className="text-gray-700">No messages yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start the conversation!</p>
                  </div>
                </div>
              )}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="p-3 bg-gray-100 border-t border-gray-200">
                <div className="relative inline-block">
                  <img 
                    src={imagePreview || "/placeholder.svg"} 
                    alt="Upload preview" 
                    className="h-20 w-auto rounded-md object-cover"
                  />
                  <button 
                    onClick={cancelImageUpload}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    className="p-3 text-gray-500 hover:text-indigo-500 transition-colors"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <FaSmile className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                  />
                  <button 
                    type="button" 
                    className="p-3 text-gray-500 hover:text-indigo-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FaPaperclip className="w-5 h-5" />
                  </button>
                  <button 
                    type="button" 
                    className="p-3 text-gray-500 hover:text-indigo-500 transition-colors md:hidden"
                  >
                    <FaCamera className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={editingMessage ? "Edit message..." : "Type a message..."}
                  className="flex-1 p-3 bg-gray-100 rounded-full outline-none 
                    focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  ref={inputRef}
                />
                <button
                  type="submit"
                  disabled={!message.trim() && selectedImages.length === 0}
                  className={`p-3 rounded-full transition-all ${
                    !message.trim() && selectedImages.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : editingMessage
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-indigo-500 text-white hover:bg-indigo-600"
                    }`}
                >
                  {editingMessage ? <FaCheck className="w-5 h-5" /> : <FaPaperPlane className="w-5 h-5" />}
                </button>
                {editingMessage && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMessage(null)
                      setMessage("")
                    }}
                    className="p-3 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-4">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
                <FaUser className="w-10 h-10 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">No chat selected</h3>
              <p className="text-gray-600 mb-6">Select a customer conversation from the sidebar to start messaging</p>
              <button
                onClick={() => setShowSidebar(true)}
                className="md:hidden px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                View Conversations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminChatInbox
