"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Smile, Download, Play, MapPin, User, ImageIcon, FileText, Volume2 } from "lucide-react"
import { type MessageInfo, MessageContentType, MessageStatus, SessionType } from "../../types/openim"

interface MessageListProps {
  conversationId: string
  currentUserId?: string
}

export default function MessageList({ conversationId, currentUserId = "user123" }: MessageListProps) {
  const [messages, setMessages] = useState<MessageInfo[]>([
    {
      clientMsgID: "msg_1",
      serverMsgID: "server_msg_1",
      createTime: Date.now() - 120000,
      sendTime: Date.now() - 120000,
      sessionType: SessionType.Single,
      sendID: "agent_001",
      recvID: currentUserId,
      msgFrom: 1,
      contentType: MessageContentType.Text,
      platformID: 1,
      senderNickname: "Customer Support",
      senderFaceUrl: "/customer-support-avatar.png",
      groupID: "",
      content: "Hello! How can I help you today?",
      seq: 1,
      isRead: true,
      status: MessageStatus.SendSuccess,
      attachedInfo: "",
      ex: "",
      hasReadTime: Date.now() - 60000,
      isReact: false,
      isExternalExtensions: false,
      textElem: {
        content: "Hello! How can I help you today?",
      },
    },
    {
      clientMsgID: "msg_2",
      serverMsgID: "server_msg_2",
      createTime: Date.now() - 60000,
      sendTime: Date.now() - 60000,
      sessionType: SessionType.Single,
      sendID: currentUserId,
      recvID: "agent_001",
      msgFrom: 1,
      contentType: MessageContentType.Text,
      platformID: 1,
      senderNickname: "You",
      senderFaceUrl: "/diverse-user-avatars.png",
      groupID: "",
      content: "I have a question about my order",
      seq: 2,
      isRead: true,
      status: MessageStatus.SendSuccess,
      attachedInfo: "",
      ex: "",
      hasReadTime: 0,
      isReact: false,
      isExternalExtensions: false,
      textElem: {
        content: "I have a question about my order",
      },
    },
    {
      clientMsgID: "msg_3",
      serverMsgID: "server_msg_3",
      createTime: Date.now() - 30000,
      sendTime: Date.now() - 30000,
      sessionType: SessionType.Single,
      sendID: "agent_001",
      recvID: currentUserId,
      msgFrom: 1,
      contentType: MessageContentType.Picture,
      platformID: 1,
      senderNickname: "Customer Support",
      senderFaceUrl: "/customer-support-avatar.png",
      groupID: "",
      content: "",
      seq: 3,
      isRead: false,
      status: MessageStatus.SendSuccess,
      attachedInfo: "",
      ex: "",
      hasReadTime: 0,
      isReact: false,
      isExternalExtensions: false,
      pictureElem: {
        sourcePath: "",
        sourcePicture: {
          uuid: "pic_1",
          type: "jpg",
          size: 1024000,
          width: 800,
          height: 600,
          url: "/order-status-screenshot.png",
        },
        bigPicture: {
          uuid: "pic_1_big",
          type: "jpg",
          size: 2048000,
          width: 1600,
          height: 1200,
          url: "/order-status-screenshot-large.png",
        },
        snapshotPicture: {
          uuid: "pic_1_thumb",
          type: "jpg",
          size: 51200,
          width: 200,
          height: 150,
          url: "/order-status-thumbnail.png",
        },
      },
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: MessageInfo = {
        clientMsgID: `msg_${Date.now()}`,
        serverMsgID: "",
        createTime: Date.now(),
        sendTime: Date.now(),
        sessionType: SessionType.Single,
        sendID: currentUserId,
        recvID: "agent_001",
        msgFrom: 1,
        contentType: MessageContentType.Text,
        platformID: 1,
        senderNickname: "You",
        senderFaceUrl: "/diverse-user-avatars.png",
        groupID: "",
        content: newMessage,
        seq: messages.length + 1,
        isRead: false,
        status: MessageStatus.Sending,
        attachedInfo: "",
        ex: "",
        hasReadTime: 0,
        isReact: false,
        isExternalExtensions: false,
        textElem: {
          content: newMessage,
        },
      }

      setMessages((prev) => [...prev, message])
      setNewMessage("")
      setIsTyping(true)

      // Simulate message status update
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.clientMsgID === message.clientMsgID
              ? { ...msg, status: MessageStatus.SendSuccess, serverMsgID: `server_${Date.now()}` }
              : msg,
          ),
        )
      }, 500)

      // Simulate agent response
      setTimeout(() => {
        setIsTyping(false)
        const agentMessage: MessageInfo = {
          clientMsgID: `msg_${Date.now() + 1}`,
          serverMsgID: `server_${Date.now() + 1}`,
          createTime: Date.now(),
          sendTime: Date.now(),
          sessionType: SessionType.Single,
          sendID: "agent_001",
          recvID: currentUserId,
          msgFrom: 1,
          contentType: MessageContentType.Text,
          platformID: 1,
          senderNickname: "Customer Support",
          senderFaceUrl: "/customer-support-avatar.png",
          groupID: "",
          content: "Thank you for your message. I'm processing your request...",
          seq: messages.length + 2,
          isRead: true,
          status: MessageStatus.SendSuccess,
          attachedInfo: "",
          ex: "",
          hasReadTime: 0,
          isReact: false,
          isExternalExtensions: false,
          textElem: {
            content: "Thank you for your message. I'm processing your request...",
          },
        }
        setMessages((prev) => [...prev, agentMessage])
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getMessageStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case MessageStatus.Sending:
        return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
      case MessageStatus.SendSuccess:
        return <div className="w-3 h-3 bg-blue-500 rounded-full" />
      case MessageStatus.SendFailure:
        return <div className="w-3 h-3 bg-red-500 rounded-full" />
      default:
        return null
    }
  }

  const renderMessageContent = (message: MessageInfo) => {
    const isCurrentUser = message.sendID === currentUserId

    switch (message.contentType) {
      case MessageContentType.Text:
        return (
          <div className="space-y-1">
            <p className="text-sm leading-relaxed">{message.textElem?.content || message.content}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                {formatTime(message.sendTime)}
              </span>
              {isCurrentUser && (
                <div className="flex items-center space-x-1">
                  {getMessageStatusIcon(message.status)}
                  {message.isRead && <span className="text-xs text-blue-100">Read</span>}
                </div>
              )}
            </div>
          </div>
        )

      case MessageContentType.Picture:
        return (
          <div className="space-y-2">
            <div className="relative group cursor-pointer">
              <img
                src={message.pictureElem?.sourcePicture.url || "/placeholder.svg"}
                alt="Shared image"
                className="max-w-xs rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                {formatTime(message.sendTime)}
              </span>
              {isCurrentUser && (
                <div className="flex items-center space-x-1">
                  {getMessageStatusIcon(message.status)}
                  {message.isRead && <span className="text-xs text-blue-100">Read</span>}
                </div>
              )}
            </div>
          </div>
        )

      case MessageContentType.File:
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {message.fileElem?.fileName || "Unknown file"}
                </p>
                <p className="text-xs text-gray-500">
                  {message.fileElem?.fileSize
                    ? `${(message.fileElem.fileSize / 1024 / 1024).toFixed(2)} MB`
                    : "Unknown size"}
                </p>
              </div>
              <button className="p-1 text-blue-500 hover:text-blue-700">
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                {formatTime(message.sendTime)}
              </span>
              {isCurrentUser && (
                <div className="flex items-center space-x-1">
                  {getMessageStatusIcon(message.status)}
                  {message.isRead && <span className="text-xs text-blue-100">Read</span>}
                </div>
              )}
            </div>
          </div>
        )

      case MessageContentType.Sound:
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
              <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                <Play className="w-4 h-4" />
              </button>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.soundElem?.duration ? `${Math.floor(message.soundElem.duration / 1000)}s` : "0s"}
                </p>
              </div>
              <Volume2 className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                {formatTime(message.sendTime)}
              </span>
              {isCurrentUser && (
                <div className="flex items-center space-x-1">
                  {getMessageStatusIcon(message.status)}
                  {message.isRead && <span className="text-xs text-blue-100">Read</span>}
                </div>
              )}
            </div>
          </div>
        )

      case MessageContentType.Location:
        return (
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {message.locationElem?.description || "Shared location"}
                  </p>
                  {message.locationElem && (
                    <p className="text-xs text-gray-500">
                      {message.locationElem.latitude.toFixed(6)}, {message.locationElem.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                {formatTime(message.sendTime)}
              </span>
              {isCurrentUser && (
                <div className="flex items-center space-x-1">
                  {getMessageStatusIcon(message.status)}
                  {message.isRead && <span className="text-xs text-blue-100">Read</span>}
                </div>
              )}
            </div>
          </div>
        )

      case MessageContentType.Card:
        return (
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <img
                  src={message.cardElem?.faceURL || "/placeholder.svg?height=40&width=40&query=user avatar"}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{message.cardElem?.nickname || "Unknown user"}</p>
                  <p className="text-xs text-gray-500">Contact card</p>
                </div>
                <User className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                {formatTime(message.sendTime)}
              </span>
              {isCurrentUser && (
                <div className="flex items-center space-x-1">
                  {getMessageStatusIcon(message.status)}
                  {message.isRead && <span className="text-xs text-blue-100">Read</span>}
                </div>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-1">
            <p className="text-sm text-gray-500 italic">Unsupported message type</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                {formatTime(message.sendTime)}
              </span>
              {isCurrentUser && (
                <div className="flex items-center space-x-1">
                  {getMessageStatusIcon(message.status)}
                  {message.isRead && <span className="text-xs text-blue-100">Read</span>}
                </div>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">CS</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Customer Support</h2>
              <p className="text-sm text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Online
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Conversation: {conversationId}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.sendID === currentUserId
          return (
            <div key={message.clientMsgID} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-end space-x-2`}
              >
                {!isCurrentUser && (
                  <img
                    src={message.senderFaceUrl || "/placeholder.svg"}
                    alt={message.senderNickname}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                )}
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    isCurrentUser
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm"
                      : "bg-white text-gray-900 rounded-bl-sm border border-gray-100"
                  }`}
                >
                  {!isCurrentUser && <p className="text-xs text-gray-500 mb-1 font-medium">{message.senderNickname}</p>}
                  {renderMessageContent(message)}
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <img src="/customer-support-avatar.png" alt="Customer Support" className="w-8 h-8 rounded-full" />
              <div className="bg-white text-gray-900 rounded-2xl rounded-bl-sm border border-gray-100 px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {/* Input Container with action buttons inside */}
          <div className="flex-1 flex items-center bg-gray-50 rounded-full border border-gray-200 px-4 py-2">
            {/* Action Buttons Row */}
            <div className="flex items-center space-x-3 mr-3">
              {/* Text Formatting */}
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors" title="Text formatting">
                <span className="text-sm font-bold">T</span>
              </button>

              {/* Emoji */}
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors" title="Emoji">
                <Smile size={16} />
              </button>

              {/* Image */}
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors" title="Image">
                <ImageIcon size={16} />
              </button>

              {/* Attachment */}
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors" title="Attachment">
                <Paperclip size={16} />
              </button>

              {/* Link */}
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors" title="Link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </button>

              {/* Contact */}
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors" title="Contact">
                <User size={16} />
              </button>

              {/* Microphone */}
              <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors" title="Voice message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn"
              className="flex-1 bg-transparent border-none focus:outline-none placeholder-gray-400 text-gray-900 text-sm"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            title="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
