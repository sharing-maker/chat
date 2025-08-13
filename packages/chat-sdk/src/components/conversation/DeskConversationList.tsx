"use client"
import { useConversationList } from "../../hooks/conversation/useConversation"

const DeskConversationList = () => {
  const { conversationList } = useConversationList()
  console.log('conversationList', conversationList)
  return (
    <div>
      <p>123</p>
    </div>
  )
}

export default DeskConversationList
