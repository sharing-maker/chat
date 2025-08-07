"use client";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatLayout } from "./ChatLayout";
export function ChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    return (<>
      {/* Chat Bubble Button */}
      <button onClick={() => setIsOpen(true)} className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-40 ${isOpen ? "scale-0" : "scale-100"}`} aria-label="Open chat">
        <MessageCircle className="w-6 h-6"/>
      </button>

      {/* Chat Window */}
      {isOpen && (<div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white">
            <h3 className="font-semibold">Chat Support</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-blue-700 rounded" aria-label="Close chat">
              <X className="w-4 h-4"/>
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <ChatLayout />
          </div>
        </div>)}

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-20 z-30" onClick={() => setIsOpen(false)}/>}
    </>);
}
