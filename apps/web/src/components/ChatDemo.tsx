"use client"

import { useState } from "react"
import { ChatProvider } from "@droppii-org/chat-sdk"
import { useChatSdkSetup } from "@web/hook/chat"
import { MessageList, ChatInput } from "@droppii-org/chat-sdk"
import { Search, MoreVertical, Phone, Video, Info } from "lucide-react"
import type { Message } from "@droppii-org/chat-sdk"

// Mock conversation data
const mockConversations = [
  {
    id: "conv-1",
    name: "Phương Huyền (phhuyen2110)",
    avatar: "/diverse-user-avatars.png",
    lastMessage: "Gửi tin nhắn từ Obefe",
    timestamp: "14:32",
    unreadCount: 1,
    isOnline: true,
    type: "Customer: hi Livechat Obefe",
  },
  {
    id: "conv-2",
    name: "Nguyễn Văn A",
    avatar: "/diverse-user-avatar-set-2.png",
    lastMessage: "Cảm ơn bạn đã hỗ trợ",
    timestamp: "13:45",
    unreadCount: 0,
    isOnline: false,
    type: "Customer: Support Request",
  },
  {
    id: "conv-3",
    name: "Trần Thị B",
    avatar: "/diverse-user-avatars-3.png",
    lastMessage: "Sản phẩm rất tốt!",
    timestamp: "12:30",
    unreadCount: 2,
    isOnline: true,
    type: "Customer: Product Inquiry",
  },
]

// Mock messages for the selected conversation
const mockMessages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    senderId: "phhuyen2110",
    content: "Gửi tin nhắn từ Obefe",
    type: "text",
    timestamp: new Date(Date.now() - 86400000), // Yesterday
    status: "read",
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    senderId: "current-user",
    content: "Reply tin nhắn từ Obefe",
    type: "text",
    timestamp: new Date(Date.now() - 86400000 + 300000), // Yesterday + 5 min
    status: "read",
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    senderId: "phhuyen2110",
    content: "Gửi tin nhắn từ Obefe",
    type: "text",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago (today)
    status: "read",
  },
  {
    id: "msg-4",
    conversationId: "conv-1",
    senderId: "current-user",
    content: "Reply tin nhắn từ Obefe",
    type: "text",
    timestamp: new Date(Date.now() - 3000000), // 50 min ago
    status: "read",
  },
  {
    id: "msg-5",
    conversationId: "conv-1",
    senderId: "phhuyen2110",
    content: "Gửi tin nhắn từ Obefe",
    type: "text",
    timestamp: new Date(Date.now() - 1800000), // 30 min ago
    status: "read",
  },
]

export function ChatDemo() {
  const { chatConfigProps } = useChatSdkSetup()
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: "current-user",
      content,
      type: "text",
      timestamp: new Date(),
      status: "sending",
    }

    setMessages((prev) => [...prev, newMessage])

    // Simulate message status update
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" as const } : msg)),
      )
    }, 1000)
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <ChatProvider config={chatConfigProps}>
        {/* Left Sidebar - Conversation List */}
        <div
          className={`
          w-80 bg-white border-r border-gray-200 flex flex-col
          ${isMobileMenuOpen ? "block" : "hidden"} md:block
        `}
        >
          {/* Sidebar Header */}
          <div className="bg-blue-600 text-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold">droppii</h1>
              <button className="p-1 hover:bg-blue-700 rounded">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-blue-100">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-sm">Tin Nhắn</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-200 hover:text-white cursor-pointer">
                <div className="w-4 h-4"></div>
                <span className="text-sm">Tài Khoản</span>
              </div>
            </div>
          </div>

          {/* Inbox Section */}
          <div className="flex-1 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">MY INBOX</h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Inbox Categories */}
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between py-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Đang mở</span>
                  </div>
                  <span className="text-gray-400">43</span>
                </div>
                <div className="flex items-center justify-between py-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Chưa phân công</span>
                  </div>
                  <span className="text-gray-400">1</span>
                </div>
                <div className="flex items-center justify-between py-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Chậm xử lý</span>
                  </div>
                  <span className="text-gray-400">1</span>
                </div>
                <div className="flex items-center justify-between py-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Chưa trả lời</span>
                  </div>
                  <span className="text-gray-400">1</span>
                </div>
                <div className="flex items-center justify-between py-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Đang xử lý</span>
                  </div>
                  <span className="text-gray-400">38</span>
                </div>
                <div className="flex items-center justify-between py-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span>Tạm chờ</span>
                  </div>
                  <span className="text-gray-400">2</span>
                </div>
                <div className="flex items-center justify-between py-2 text-blue-600 font-medium cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Đã đóng</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {mockConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`
                    p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
                    ${selectedConversation.id === conversation.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={conversation.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.type}</p>
                      <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  className="md:hidden p-2 hover:bg-gray-100 rounded"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                    <div className="w-full h-0.5 bg-gray-600"></div>
                    <div className="w-full h-0.5 bg-gray-600"></div>
                    <div className="w-full h-0.5 bg-gray-600"></div>
                  </div>
                </button>

                <div className="relative">
                  <img
                    src={selectedConversation.avatar || "/placeholder.svg"}
                    alt={selectedConversation.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {selectedConversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">{selectedConversation.name}</h2>
                  <p className="text-sm text-gray-500">2 Thành viên</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <select className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Đang xử lý</option>
                  <option>Đã đóng</option>
                  <option>Chờ xử lý</option>
                </select>

                <div className="flex items-center space-x-1">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Video className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Info className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            <MessageList messages={messages} currentUserId="current-user" conversationId={selectedConversation.id} />
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200">
            <ChatInput
              conversationId={selectedConversation.id}
              onSendMessage={handleSendMessage}
              placeholder="Nhập tin nhắn"
            />
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </ChatProvider>
    </div>
  )
}
