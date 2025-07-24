"use client"

import { ChatBubble } from "@chat-sdk/src/components/ChatBubble"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Modern React Chat SDK</h1>
          <p className="text-xl text-gray-600 mb-8">A comprehensive chat solution for modern web applications</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">Real-time Messaging</h3>
            <p className="text-gray-600">
              Built-in support for real-time messaging with typing indicators and message status.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">Rich Media Support</h3>
            <p className="text-gray-600">
              Send images, files, emojis, and stickers with built-in preview capabilities.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">Customizable UI</h3>
            <p className="text-gray-600">Fully customizable components that match your brand and design system.</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Try the chat bubble in the bottom right corner!</p>
        </div>
      </div>

      <ChatBubble />
    </main>
  )
}
