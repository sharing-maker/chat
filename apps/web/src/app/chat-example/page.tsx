"use client"

import { ChatProvider, DChatDeskMessage } from "@droppii-org/chat-sdk"
import { useChatSdkSetup } from "@web/hook/chat"



export default function ChatDemo() {
  const { chatConfigProps } = useChatSdkSetup()
  return (
    <div className="h-screen bg-gray-50">
      <ChatProvider
        config={chatConfigProps}
      >
        <div className="h-full">
          <DChatDeskMessage />
        </div>
      </ChatProvider>
    </div>
  )
}
