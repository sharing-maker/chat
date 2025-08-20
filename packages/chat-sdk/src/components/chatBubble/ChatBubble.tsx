"use client";
import { useState } from "react";
import { FloatButton, Drawer } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
import MessageList from "../message/MessageList";
import { SessionType } from "@openim/wasm-client-sdk";
import { useConversationDetail } from "../../hooks/conversation/useConversation";

interface ChatBubbleProps {
  conversationId: string;
  sourceID: string;
  sessionType: SessionType;
  className?: string;
}

const ChatBubble = ({
  conversationId,
  sourceID,
  sessionType,
  className,
}: ChatBubbleProps) => {
  const { conversationDetail } = useConversationDetail({
    sourceID,
    sessionType,
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <FloatButton
        icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
        type="primary"
        style={{
          right: 24,
          bottom: 24,
          width: 60,
          height: 60,
        }}
        onClick={toggleChat}
        className={className}
      />

      {/* Chat Panel Drawer */}
      <Drawer
        placement="right"
        onClose={() => setIsOpen(false)}
        open={isOpen}
        mask={true}
        closable={false}
        styles={{
          body: { padding: 0 },
        }}
        classNames={{
          wrapper: "!z-[9999]",
        }}
      >
        <MessageList
          conversationId={conversationId}
          conversationData={conversationDetail}
          className="flex-1"
          onClose={() => setIsOpen(false)}
        />
      </Drawer>
    </>
  );
};

export default ChatBubble;
