"use client"

import { useState } from "react"
import { ConversationList } from "./ConversationList"
import { ChatHeader } from "./ChatHeader"
import { MessageList } from "./MessageList"
import { ChatInput } from "./ChatInput"
import { useChatContext } from "../context/ChatContext"
import { useSwipeGesture } from "../hooks/useSwipeGesture"
import { useMessages } from "../hooks/useMessages"

interface ChatLayoutProps {
  className?: string
}

export function ChatLayout({ className = "" }: ChatLayoutProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const { state } = useChatContext()
  const messagesHook = useMessages(selectedConversationId || "")

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    setShowSidebar(false) // Hide sidebar on mobile after selection
  }

  const handleBackToList = () => {
    setSelectedConversationId(null)
    setShowSidebar(true)
  }

  // Swipe gesture for going back to conversation list
  const swipeRef = useSwipeGesture({
    onSwipeRight: () => {
      // Only trigger on mobile when a conversation is selected
      if (selectedConversationId && window.innerWidth < 768) {
        handleBackToList()
      }
    },
    threshold: 100, // Minimum swipe distance
    restraint: 100, // Maximum vertical movement allowed
    allowedTime: 300, // Maximum time for swipe
    enabled: !!selectedConversationId, // Only enable when conversation is selected
  }) as React.RefObject<HTMLDivElement>

  return (
    <div className={`flex h-screen bg-white ${className}`} ref={swipeRef}>
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowSidebar(false)} />
      )}

      {/* Sidebar - Separate scroll container */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-full bg-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:w-80 md:border-r md:border-gray-200
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        ${selectedConversationId ? "hidden md:flex" : "flex"}
        flex-col h-full
      `}
      >
        {/* Sidebar Header - Fixed */}
        <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <div className="flex items-center space-x-2">
              {!state.isConnected && (
                <div className="flex items-center text-xs text-gray-500">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  <span className="hidden sm:inline">Demo Mode</span>
                </div>
              )}
              {/* Mobile close button */}
              <button
                onClick={() => setShowSidebar(false)}
                className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Conversation List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            selectedConversationId={selectedConversationId || undefined}
            onConversationSelect={handleConversationSelect}
            className="h-full"
          />
        </div>
      </div>

      {/* Main Chat Area - Separate scroll container */}
      <div
        className={`
        flex-1 flex flex-col relative h-full
        ${selectedConversationId ? "flex" : "hidden md:flex"}
      `}
      >
        {selectedConversationId ? (
          <>
            {/* Swipe indicator for mobile */}
            <div className="md:hidden absolute top-2 left-2 z-10 pointer-events-none">
              <div className="bg-black bg-opacity-20 text-white text-xs px-2 py-1 rounded-full opacity-0 transition-opacity duration-200 swipe-hint">
                ← Swipe to go back
              </div>
            </div>

            {/* Chat Header - Fixed */}
            <div className="flex-shrink-0">
              <ChatHeader
                conversationId={selectedConversationId}
                onBackClick={handleBackToList}
                onMenuClick={() => setShowSidebar(true)}
              />
            </div>

            {/* Message List - Scrollable */}
            <div className="flex-1 min-h-0">
              {" "}
              {/* Added min-h-0 here */}
              <MessageList
                messages={messagesHook.messages}
                currentUserId={state.config?.userId || ""}
                conversationId={selectedConversationId}
                className="h-full"
              />
            </div>

            {/* Chat Input - Fixed */}
            <div className="flex-shrink-0">
              <ChatInput />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Choose a conversation from the sidebar to start messaging
              </p>
              {!state.isConnected && (
                <p className="text-xs text-gray-400 mt-2">Running in demo mode - WebSocket disabled</p>
              )}
              <button
                onClick={() => setShowSidebar(true)}
                className="mt-4 md:hidden px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
