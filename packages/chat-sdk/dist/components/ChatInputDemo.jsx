"use client";
import { useState } from "react";
import { ChatInput } from "./ChatInput";
export function ChatInputDemo() {
    const [messages, setMessages] = useState([]);
    const handleSendMessage = (message) => {
        setMessages((prev) => [...prev, message]);
        console.log("Message sent:", message);
    };
    const handleEmojiClick = (emoji) => {
        console.log("Emoji clicked:", emoji);
    };
    const handleStickerClick = (sticker) => {
        console.log("Sticker clicked:", sticker);
        setMessages((prev) => [...prev, `Sticker: ${sticker}`]);
    };
    const handleFileUpload = (file) => {
        console.log("File uploaded:", file.name);
        setMessages((prev) => [...prev, `📎 File: ${file.name}`]);
    };
    const handleImageUpload = (file) => {
        console.log("Image uploaded:", file.name);
        setMessages((prev) => [...prev, `🖼️ Image: ${file.name}`]);
    };
    const handleContactShare = () => {
        console.log("Contact share clicked");
        setMessages((prev) => [...prev, "👤 Contact shared"]);
    };
    const handleVoiceRecord = () => {
        console.log("Voice record clicked");
    };
    const handleQuickReact = () => {
        console.log("Quick react clicked");
        setMessages((prev) => [...prev, "👍"]);
    };
    return (<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Mock Chat Messages */}
      <div className="h-96 p-4 bg-gray-50 overflow-y-auto">
        <div className="space-y-3">
          <div className="text-center text-gray-500 text-sm mb-4">Demo Chat Interface</div>
          {messages.map((message, index) => (<div key={index} className="flex justify-end">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-tr-md max-w-xs">{message}</div>
            </div>))}
          {messages.length === 0 && (<div className="text-center text-gray-400 text-sm">
              Type a message, select emoji, or send sticker to test the ChatInput component
            </div>)}
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} onEmojiClick={handleEmojiClick} onStickerClick={handleStickerClick} onFileUpload={handleFileUpload} onImageUpload={handleImageUpload} onContactShare={handleContactShare} onVoiceRecord={handleVoiceRecord} onQuickReact={handleQuickReact} placeholder="Nhập tin nhắn"/>
    </div>);
}
