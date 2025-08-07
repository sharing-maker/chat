"use client"

import { ChatLayout, ChatProvider } from "@droppii-org/chat-sdk"



export default function ChatDemo() {
  return (
    <div className="h-screen bg-gray-50">
      <ChatProvider
        userId="current-user"
        token="demo-token"
        websocketUrl="demo"
        enableWebSocket={false}
      >
        <div className="h-full">
          <ChatLayout />
        </div>
      </ChatProvider>
    </div>
  )
}
