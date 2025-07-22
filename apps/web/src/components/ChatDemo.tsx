"use client"

import { ChatProvider, ChatLayout } from "./chat-sdk"

export function ChatDemo() {
  return (
    <div className="h-screen bg-gray-50">
      <ChatProvider userId="current-user" token="demo-token" websocketUrl="demo" enableWebSocket={false}>
        <div className="h-full">
          <ChatLayout />
        </div>
      </ChatProvider>
    </div>
  )
}
