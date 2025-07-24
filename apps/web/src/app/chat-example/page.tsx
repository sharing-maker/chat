import { ChatInput } from "@chat-sdk"

export default function ChatExample() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Chat Input Example</h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <ChatInput />
        </div>
      </div>
    </div>
  )
}
