"use client";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useMessages } from "../hooks/useMessages";
export function ChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState('conv-1');
    console.log("🚀 ~ ChatBubble ~ isOpen:", isOpen);
    const messagesHook = useMessages(selectedConversationId || "");
    return (<>
      {/* Chat Bubble Button */}
      <button onClick={() => setIsOpen(true)} className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-40 ${isOpen ? "scale-0" : "scale-100"}`} aria-label="Open chat">
        <MessageCircle className="w-6 h-6"/>
      </button>

      {/* Chat Window */}
      {isOpen && (<div className="fixed bottom-6 right-6 w-96 h-[700px] max-h-[80%] bg-white rounded-lg shadow-2xl border z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white">
            <h3 className="font-semibold">Chat Support</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-blue-700 rounded" aria-label="Close chat">
              <X className="w-4 h-4"/>
            </button>
          </div>

          {/* Chat Content */}
          <div className={`
        flex-1 flex flex-col relative h-[calc(100%-50px)]
        ${selectedConversationId ? "flex" : "hidden md:flex"}
      `}>
        {selectedConversationId ? (<>
            {/* Swipe indicator for mobile */}
            <div className="md:hidden absolute top-2 left-2 z-10 pointer-events-none">
              <div className="bg-black bg-opacity-20 text-white text-xs px-2 py-1 rounded-full opacity-0 transition-opacity duration-200 swipe-hint">
                ← Swipe to go back
              </div>
            </div>

            {/* Chat Header - Fixed */}
            <div className="flex-shrink-0">
              <ChatHeader conversationId={selectedConversationId} onBackClick={() => setIsOpen(false)} onMenuClick={() => setIsOpen(false)}/>
            </div>

            {/* Message List - Scrollable */}
            <div className="flex-1 min-h-0">
              {" "}
              {/* Added min-h-0 here */}
              <MessageList messages={messagesHook.messages} currentUserId={"current-user"} conversationId={selectedConversationId} className="h-full"/>
            </div>

            {/* Chat Input - Fixed */}
            <div className="flex-shrink-0">
              <ChatInput />
            </div>
          </>) : (<div className="flex-1 flex items-center justify-center text-gray-500 p-4">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Choose a conversation from the sidebar to start messaging
              </p>
              <button onClick={() => setIsOpen(false)} className="mt-4 md:hidden px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                View Conversations
              </button>
            </div>
          </div>)}
      </div>
        </div>)}

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-20 z-30" onClick={() => setIsOpen(false)}/>}
    </>);
}
