"use client";

import {
  ChatBubble,
  DChatDeskMessage,
  DChatSessionType,
} from "@droppii-org/chat-sdk";

export default function ChatPage() {
  return (
    <div className="h-full">
      <DChatDeskMessage />
      <ChatBubble
        conversationId="sg_3408237279"
        sourceID="3408237279"
        sessionType={DChatSessionType.Group}
      />
    </div>
  );
}
