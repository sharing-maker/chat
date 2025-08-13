"use client"

import { useState, useRef } from "react"
import Users from "path/to/Users"
import Phone from "path/to/Phone"
import Video from "path/to/Video"
import MoreHorizontal from "path/to/MoreHorizontal"
import MessageCircle from "path/to/MessageCircle"
import ChatInput from "path/to/ChatInput"
import DateDivider from "path/to/DateDivider"
import MessageItem from "path/to/MessageItem"
import TypingIndicator from "path/to/TypingIndicator"
import ImagePreviewModal from "path/to/ImagePreviewModal"

const MessageList = ({ messages, className }) => {
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newMessageAnimation, setNewMessageAnimation] = useState("")
  const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false)
  const [previewImages, setPreviewImages] = useState([])
  const [initialPreviewImageId, setInitialPreviewImageId] = useState("")
  const scrollRef = useRef(null)
  const messageSwipeRef = useRef(null)

  const scrollToBottom = (smooth) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      setShowScrollToBottomButton(scrollTop + clientHeight < scrollHeight - 100)
    }
  }

  const handleImageClick = (imageId) => {
    setIsImagePreviewModalOpen(true)
    setInitialPreviewImageId(imageId)
  }

  const messageGroups = [
    // Example message groups
    { date: "2023-10-01", messages: [] },
    { date: "2023-10-02", messages: [] },
  ]

  const formatDateLabel = (date) => {
    return date.toLocaleDateString()
  }

  if (!messages || messages.length === 0) {
    return (
      <div className={`flex flex-col h-full bg-white ${className}`}>
        {/* Enhanced header with proper styling */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Support Chat</h2>
                <p className="text-sm text-green-600 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced empty state with better styling */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="text-center max-w-sm mx-auto px-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <MessageCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to Droppii Chat</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Start a conversation with our support team. We're here to help you with any questions or concerns.
            </p>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">
                💡 Tip: You can send images, files, and use formatting in your messages
              </p>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200">
          <ChatInput conversationId={null} placeholder="Type your message..." />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Enhanced header with better styling and status */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Support Chat</h2>
              <p className="text-sm text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Online • Typically replies in minutes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showSwipeHint && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
          <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg animate-bounce flex items-center space-x-2">
            <span>👈</span>
            <span>Vuốt phải để quay lại</span>
          </div>
        </div>
      )}

      {showScrollToBottomButton && (
        <div className="absolute bottom-28 right-6 z-10">
          <button
            onClick={() => scrollToBottom(true)}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105"
            aria-label="Scroll to bottom"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white text-gray-600 text-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading messages...</span>
          </div>
        </div>
      )}

      {/* Enhanced message area with gradient background */}
      <div className="flex-1 relative bg-gradient-to-b from-gray-50 to-white">
        <div
          ref={(el) => {
            scrollRef.current = el
            if (messageSwipeRef.current !== el) {
              messageSwipeRef.current = el as HTMLElement
            }
          }}
          className="h-full overflow-y-auto px-6 py-6"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
          }}
          onScroll={handleScroll}
        >
          <div className="space-y-8">
            {messageGroups.map((group, groupIndex) => (
              <div key={group.date} className="space-y-4">
                <DateDivider date={new Date(group.date)} customLabel={formatDateLabel(new Date(group.date))} />
                <div className="space-y-2">
                  {group.messages.map((message, messageIndex) => {
                    const prevMessage = messageIndex > 0 ? group.messages[messageIndex - 1] : null
                    const isGrouped =
                      prevMessage?.sendID === message.sendID &&
                      new Date(message.sendTime).getTime() - new Date(prevMessage.sendTime).getTime() < 300000

                    return (
                      <div
                        key={message.clientMsgID}
                        className={`transform transition-all duration-300 ${
                          newMessageAnimation === message.clientMsgID ? "animate-fade-in-up" : ""
                        }`}
                      >
                        <MessageItem message={message} isGrouped={isGrouped} onImageClick={handleImageClick} />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {null && (
            <div className="mt-6">
              <TypingIndicator conversationId={null} />
            </div>
          )}

          {/* Bottom padding for better scroll experience */}
          <div className="h-6"></div>
        </div>
      </div>

      {/* Enhanced chat input with shadow */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 shadow-lg">
        <ChatInput conversationId={null} placeholder="Type your message..." />
      </div>

      {/* Image Preview Modal */}
      {isImagePreviewModalOpen && (
        <ImagePreviewModal
          images={previewImages}
          initialImageId={initialPreviewImageId}
          onClose={() => setIsImagePreviewModalOpen(false)}
        />
      )}
    </div>
  )
}

export default MessageList
