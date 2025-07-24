import ChatBubble from "../../components/chat-sdk/components/ChatBubble"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Chat SDK Demo Page</h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          This is a dedicated demo page for testing the chat functionality.
        </p>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Features</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Multiple conversation support
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Real-time message delivery
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Responsive design
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Easy customization
            </li>
          </ul>
        </div>
      </div>

      <ChatBubble />
    </div>
  )
}
