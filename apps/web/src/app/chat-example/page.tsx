"use client"

import { ChatProvider } from "@droppii-org/chat-sdk"
import { useChatSdkSetup } from "@web/hook/chat"



export default function ChatDemo() {
  const { chatConfigProps } = useChatSdkSetup()
  return (
    <div className="h-screen bg-gray-50">
      <ChatProvider
        config={chatConfigProps}
      >
        <div className="h-full">
          <p>Version: 0.0.2</p>
        </div>
      </ChatProvider>
    </div>
  )
}
