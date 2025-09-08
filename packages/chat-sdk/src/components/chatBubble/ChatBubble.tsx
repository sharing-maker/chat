"use client";
import { useEffect, useState } from "react";
import { FloatButton, Drawer, Popover } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
import MessageList from "../message/MessageList";
import useConversationStore from "../../store/conversation";

interface ChatBubbleProps {
  className?: string;
}

const ChatBubble = ({ className }: ChatBubbleProps) => {
  const [isMobile, setIsMobile] = useState(false);

  const selectedConversationId = useConversationStore(
    (state) => state.selectedConversationId
  );

  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <>
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
            conversationId={selectedConversationId}
            className="flex-1"
            onClose={() => setIsOpen(false)}
          />
        </Drawer>
      </>
    );
  }

  return (
    <Popover
      placement="topLeft"
      trigger="click"
      content={
        <div style={{ width: 400, height: 640 }}>
          <MessageList
            conversationId={selectedConversationId}
            className="flex-1"
            onClose={() => setIsOpen(false)}
          />
        </div>
      }
      styles={{ body: { padding: 0 } }}
    >
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
    </Popover>
  );
};

export default ChatBubble;
