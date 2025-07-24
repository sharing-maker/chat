import ChatBubble from "../components/chat-sdk/components/ChatBubble"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">React Chat SDK Demo</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to the Chat SDK</h2>
          <p className="text-gray-600 mb-6">
            This is a demonstration of our React Chat SDK. The chat bubble in the bottom right corner provides a
            complete chat interface with conversations, messages, and real-time features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Features</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Real-time messaging</li>
                <li>• Conversation management</li>
                <li>• Image sharing</li>
                <li>• Typing indicators</li>
                <li>• Mobile responsive</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Easy Integration</h3>
              <ul className="text-green-800 space-y-1">
                <li>• Drop-in component</li>
                <li>• Customizable themes</li>
                <li>• TypeScript support</li>
                <li>• Minimal dependencies</li>
                <li>• Well documented</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ChatBubble />
    </main>
  )
}
