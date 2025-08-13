"use client"

import MessageList from "./MessageList"

const DChatDeskMessage = () => {
  return (
    <div className="h-screen bg-gray-50">
      <div className="h-full flex flex-col">
        <MessageList conversationId="sg_3408237279" currentUserId="user123" />
      </div>
    </div>
  )
}

export default DChatDeskMessage
