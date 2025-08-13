"use client"
import { useConversationList } from "../../hooks/conversation/useConversation"
import { MessageCircle, Search, Plus } from "lucide-react"

const DeskConversationList = () => {
  const { conversationList } = useConversationList()

  return (
    <div className="flex flex-col h-full">
    </div>
  )
}

export default DeskConversationList
