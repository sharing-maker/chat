import ChatFooter from "../packages/chat-sdk/src/components/message/footer/ChatFooter"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Droppii Chat Demo</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Chat Footer Component</h2>
          <p className="text-gray-600 mb-6">
            This is a demo of the ChatFooter component with Lexical rich text editor, formatting toolbar, and action
            buttons.
          </p>

          <ChatFooter />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Features:</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Rich text formatting (Bold, Italic, Strikethrough)</li>
            <li>• Lists (Numbered and Bulleted)</li>
            <li>• Links, Quotes, and Code blocks</li>
            <li>• Action buttons for emoji, files, and media</li>
            <li>• Responsive design with Tailwind CSS</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
