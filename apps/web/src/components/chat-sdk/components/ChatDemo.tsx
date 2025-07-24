"use client"

import React from "react"
import { ChatProvider, ChatLayout } from ".."
import { ChatBubble } from "./ChatBubble"

const ChatDemo: React.FC = () => {
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

export default ChatDemo
