"use client"
import { ChatBubble } from "../packages/chat-sdk/src/components/chat-bubble/ChatBubble"
import { ChatProvider } from "../packages/chat-sdk/src/context/ChatContext"
import { type ConversationItem, SessionType } from "@openim/wasm-client-sdk"

// Mock conversation data for demo
const mockConversationData: ConversationItem = {
  conversationID: "demo-conversation-123",
  conversationType: SessionType.Single,
  userID: "user-123",
  groupID: "",
  showName: "Demo Chat",
  faceURL: "",
  recvMsgOpt: 0,
  unreadCount: 0,
  groupAtType: 0,
  latestMsg: null,
  latestMsgSendTime: Date.now(),
  draftText: "",
  draftTextTime: 0,
  isPinned: false,
  isPrivateChat: false,
  burnDuration: 0,
  isNotInGroup: false,
  updateUnreadCountTime: 0,
  attachedInfo: "",
  ex: "",
}

export default function HomePage() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Chat SDK Demo</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">ChatBubble Component</h2>
            <p className="text-gray-600 mb-4">
              The ChatBubble component provides a floating chat interface that can be positioned at the bottom right of
              your application. Click the chat bubble to open the chat panel.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Features:</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Floating chat bubble button</li>
                <li>• Toggle open/close chat panel</li>
                <li>• Fixed dimensions positioned above the bubble</li>
                <li>• Integrates with MessageList component</li>
                <li>• Built with Ant Design components</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Example</h2>
            <pre className="bg-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
              {`import { ChatBubble } from "@droppii-org/chat-sdk"

<ChatBubble 
  conversationId="your-conversation-id"
  conversationData={conversationData}
/>`}
            </pre>
          </div>
        </div>

        {/* ChatBubble Component - positioned at bottom right */}
        <ChatBubble conversationId="demo-conversation-123" conversationData={mockConversationData} />
      </div>
    </ChatProvider>
  )
}
