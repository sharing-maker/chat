import { ChatProvider, ChatLayout } from "@chat-sdk"

export default function DemoPage() {
  return (
    <div className="h-screen bg-gray-50">
      <ChatProvider userId="demo-user" token="demo-token" websocketUrl="demo" enableWebSocket={false}>
        <ChatLayout />
      </ChatProvider>
    </div>
  )
}
