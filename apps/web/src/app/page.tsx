import ChatBubble from "../components/chat-sdk/components/ChatBubble"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">React Chat SDK Demo</h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Click the chat bubble in the bottom right corner to start chatting!
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Real-time Chat</h3>
              <p className="text-gray-600">Experience seamless real-time messaging with our chat SDK.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Multiple Conversations</h3>
              <p className="text-gray-600">Manage multiple conversations with different teams and contacts.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Easy Integration</h3>
              <p className="text-gray-600">Simple to integrate into any React application with minimal setup.</p>
            </div>
          </div>
        </div>
      </div>

      <ChatBubble />
    </div>
  )
}
