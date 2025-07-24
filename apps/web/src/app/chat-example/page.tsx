"use client"

import { ChatLayout } from "@chat-sdk/src/components/ChatLayout"
import { ChatProvider } from "@chat-sdk/src/context/ChatContext"


export default function ChatDemo() {
  return (
    <div className="h-screen bg-gray-50">
      <ChatProvider
        userId="current-user"
        token="demo-token"
        websocketUrl="demo"
        enableWebSocket={false}
        currentUser={{ id: "current-user", name: "You", avatar: "/placeholder-user.jpg", isOnline: true }}
      >
        <div className="h-full">
          <ChatLayout />
        </div>
      </ChatProvider>
    </div>
  )
}
