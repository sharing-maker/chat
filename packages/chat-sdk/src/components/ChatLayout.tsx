"use client"
import { useChatContext } from "../context/ChatContext"
import { ChatHeader } from "./ChatHeader"
import { MessageList } from "./MessageList"
import { ChatInput } from "./ChatInput"

export function ChatLayout() {
  const { state } = useChatContext()

  if (!state.currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <MessageList />
      <ChatInput />
    </div>
  )
}
