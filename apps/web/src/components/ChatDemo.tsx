"use client"
import { ChatProvider } from "@droppii-org/chat-sdk"
import { useChatSdkSetup } from "@web/hook/chat"


export function ChatDemo() {
  const { chatConfigProps } = useChatSdkSetup()
  return (
    <div className="h-screen bg-gray-50">
      <ChatProvider config={chatConfigProps}>
        <div className="h-full">
          {/* <ChatLayout />
          <ChatBubble /> */}
        </div>
      </ChatProvider>
    </div>
  )
}
