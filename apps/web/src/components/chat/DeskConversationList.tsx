"use client"

import { useChatContext } from "./ChatProvider"

export default function DeskConversationList() {
  const { conversations, activeConversation, setActiveConversation } = useChatContext()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setActiveConversation(conversation.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              activeConversation === conversation.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{conversation.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
