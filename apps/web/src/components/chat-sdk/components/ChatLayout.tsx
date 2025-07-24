"use client"
import { useChatContext } from "../context/ChatContext"
import { ConversationList } from "./ConversationList"
import { ChatHeader } from "./ChatHeader"
import { MessageList } from "./MessageList"
import { ChatInput } from "./ChatInput"

interface ChatLayoutProps {
  onClose: () => void
}

export function ChatLayout({ onClose }: ChatLayoutProps) {
  const { state, setCurrentConversation } = useChatContext()
  const { currentConversationId, conversations } = state

  const currentConversation = conversations.find((c) => c.id === currentConversationId)

  return (
    <div className="flex flex-col h-full">
      {!currentConversationId ? (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ConversationList conversations={conversations} onSelectConversation={setCurrentConversation} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <ChatHeader conversation={currentConversation} onBack={() => setCurrentConversation("")} onClose={onClose} />
          <div className="flex-1 overflow-hidden">
            <MessageList conversationId={currentConversationId} />
          </div>
          <ChatInput conversationId={currentConversationId} />
        </div>
      )}
    </div>
  )
}
