"use client"

import { ChatProvider } from "@chat-sdk/src/context/ChatContext"
import { ChatLayout } from "@chat-sdk/src/components/ChatLayout"
import { ChatBubble } from "@chat-sdk/src/components/ChatBubble"

export function ChatDemo() {
  return (
    <div className="h-screen bg-gray-50">
      <ChatProvider userId="current-user" token="demo-token" websocketUrl="demo" enableWebSocket={false}>
        <div className="h-full">
          <ChatLayout />
          <ChatBubble />
        </div>
      </ChatProvider>
    </div>
  )
}
