'use client'

import MessageList from "../../components/message/MessageList"
import DeskConversationList from "../../components/conversation/DeskConversationList"

const DChatDeskMessage = () => {
  return (
    <div>
      <DeskConversationList />
      <MessageList conversationId="sg_3408237279" />
    </div>
  )
}

export default DChatDeskMessage