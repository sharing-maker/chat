"use client"

import MessageList from "./MessageList"
import DeskConversationList from "./DeskConversationList"

const DChatDeskMessage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for conversations */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Droppii Chat Support</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <DeskConversationList />
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <MessageList conversationId="sg_3408237279" />
      </div>
    </div>
  )
}

export default DChatDeskMessage
