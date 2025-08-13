"use client"
import { ConversationItem } from "@openim/wasm-client-sdk";
import { useChatContext } from "../../context/ChatContext"
import { useMessage } from "../../hooks/message/useMessage"
import { ScrollArea } from "radix-ui";

interface MessageListProps {
  conversationId: string
  conversationData: ConversationItem | null
  className?: string
}

const MessageList = (props: MessageListProps) => {
  const { conversationId, conversationData } = props
  const messages = useMessage(conversationId)
  const { user } = useChatContext()
  return (
    <div className="">
      <div className="px-2 py-4 flex items-center">

      </div>
      <ScrollArea.Root className="flex-1 bg-white">
        <ScrollArea.Viewport>
          
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </div>
  )
}

export default MessageList