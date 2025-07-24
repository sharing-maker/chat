"use client"

import { ChatProvider } from "../context/ChatContext"
import { ChatLayout } from "../components/ChatLayout"

export function ChatDemo() {
  return (
    <div className="h-screen bg-gray-50">
      <ChatProvider
        userId="current-user"
        token="demo-token"
        websocketUrl="demo"
        enableWebSocket={false} // Explicitly disable WebSocket for demo
      >
        <div className="h-full">
          <ChatLayout />
        </div>
      </ChatProvider>
    </div>
  )
}
