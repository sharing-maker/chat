"use client"

import { ChatProvider } from "../context/ChatContext"
import { ConversationList } from "../components/ConversationList"
import { ChatLayout } from "../components/ChatLayout"

// Example 1: Basic usage with full layout
export function BasicChatExample() {
  return (
    <ChatProvider
      userId="user-123"
      token="your-auth-token"
      websocketUrl="wss://your-chat-server.com"
      onTokenRefresh={async () => {
        // Refresh your auth token here
        return "new-token"
      }}
    >
      <div className="h-screen">
        <ChatLayout />
      </div>
    </ChatProvider>
  )
}

// Example 2: Custom layout using individual components
export function CustomChatExample() {
  return (
    <ChatProvider userId="user-123" token="your-auth-token">
      <div className="flex h-screen">
        <div className="w-80 border-r">
          <ConversationList />
        </div>
        <div className="flex-1">
          {/* Your custom chat area */}
          <div className="p-4">Custom chat implementation using hooks</div>
        </div>
      </div>
    </ChatProvider>
  )
}
