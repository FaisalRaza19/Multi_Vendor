import React, { useState } from 'react'
import { IoSend, IoMenu, IoClose } from 'react-icons/io5'

// Sample data for users and messages
const users = [
  { id: 1, name: 'Shahriar Sajeeb', lastMessage: 'Yeah I am also fine!', avatar: '/placeholder.svg' },
  { id: 2, name: 'John Doe', lastMessage: 'Yeap I am good.', avatar: '/placeholder.svg' },
  { id: 3, name: 'Jane Smith', lastMessage: 'See you tomorrow!', avatar: '/placeholder.svg' },
  { id: 4, name: 'Alice Johnson', lastMessage: 'Thanks for your help!', avatar: '/placeholder.svg' },
  { id: 5, name: 'Bob Williams', lastMessage: 'Let me know when you\'re free.', avatar: '/placeholder.svg' },
]

const userMessages = [
  "Hey How are you doing?",
  "Yeah I am also fine!",
  "Can you show me some products?",
  "That's great! I'll take two.",
]

const shopkeeperMessages = [
  "Hello there",
  "I am fine, thank you! How can I help you today?",
  "Of course! We have a great selection. What are you looking for specifically?",
  "Excellent choice! I'll prepare your order right away.",
]

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(users[0])

  return (
    <div className="flex h-auto bg-gray-100 mt-28">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50"
      >
        {isSidebarOpen ? (
          <IoClose size={24} className="text-gray-600" />
        ) : (
          <IoMenu size={24} className="text-gray-600 space-x-10" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 w-80 bg-white border-r transform 
        ${isSidebarOpen ? ('translate-x-0', "z-40") : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-200 ease-in-out
        flex flex-col min-h-full
      `}>
        {/* Active User */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12">
              <img
                src="/placeholder.svg"
                alt="Your avatar"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">Your Name</p>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative w-12 h-12">
                  <img
                    src={user.avatar}
                    alt='avatar'
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">You: {user.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b p-4 flex items-center space-x-4">
          <div className="md:hidden w-6" /> {/* Spacer for mobile menu button */}
          <div className="relative w-12 h-12">
            <img
              src={selectedUser.avatar}
              alt='avatar'
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-sm font-medium">{selectedUser.name}</h2>
            <p className="text-xs text-green-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Active now
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 relative overflow-y-auto p-4">
          <div className="">
            {userMessages.map((message, index) => (
              <div key={`user-${index}`} className="flex justify-end mb-3">
                <div className="bg-[#4339f2] text-white rounded-2xl py-2 px-4 max-w-[80%] break-words">
                  {message.length > 40
                    ? message.match(/.{1,40}/g).map((chunk, i) => (
                      <div key={`user-chunk-${index}-${i}`}>{chunk}</div>
                    ))
                    : message}
                </div>
              </div>
            ))}
            {shopkeeperMessages.map((message, index) => (
              <div key={`shopkeeper-${index}`} className="flex justify-start mb-4">
                <div className="bg-[#40c7d7] text-white rounded-2xl py-2 px-4 max-w-[80%] break-words">
                  {message.length > 40
                    ? message.match(/.{1,40}/g).map((chunk, i) => (
                      <div key={`shopkeeper-chunk-${index}-${i}`}>{chunk}</div>
                    ))
                    : message}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Message Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center space-x-2 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Write your message..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#4339f2] focus:border-transparent"
            />
            <button className="p-3 rounded-full bg-[#4339f2] text-white hover:bg-[#4339f2]/90 transition-colors">
              <IoSend size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default ChatPage;
