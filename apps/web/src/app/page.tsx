import { ChatBubble } from "@chat-sdk"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">React Chat SDK Demo</h1>
        <p className="text-lg text-center text-gray-600 mb-12">
          Click the chat bubble in the bottom right corner to start a conversation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Real-time Chat</h2>
            <p className="text-gray-600">Experience seamless real-time messaging with instant responses.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Multiple Conversations</h2>
            <p className="text-gray-600">Manage multiple conversations with easy switching.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Responsive Design</h2>
            <p className="text-gray-600">Works perfectly on desktop and mobile devices.</p>
          </div>
        </div>
      </main>

      <ChatBubble />
    </div>
  )
}
