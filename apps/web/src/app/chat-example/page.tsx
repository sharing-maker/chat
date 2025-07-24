import { ChatInput } from "@chat-sdk/components/ChatInput"

export default function ChatExample() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Chat Input Example</h1>
        <div className="bg-white rounded-lg shadow-sm border">
          <ChatInput
            conversationId="example-chat"
            placeholder="Type your message here..."
            onSendMessage={(message) => {
              console.log("Message sent:", message)
            }}
          />
        </div>
      </div>
    </div>
  )
}
