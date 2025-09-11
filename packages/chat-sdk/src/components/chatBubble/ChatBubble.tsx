"use client";
import { useState } from "react";
import { FloatButton, Drawer, Popover } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
import MessageList from "../message/MessageList";
import useConversationStore from "../../store/conversation";
import { useIsMobile } from "../../hooks/common/useIsMobile";

interface ChatBubbleProps {
  className?: string;
}

const ChatBubble = ({ className }: ChatBubbleProps) => {
  const isMobile = useIsMobile();

  const selectedConversationId = useConversationStore(
    (state) => state.selectedConversationId
  );

  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

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
          width={"100%"}
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
      open={isOpen}
      onOpenChange={setIsOpen}
      content={
        <div className="w-[400px] h-[600px]">
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
        className={className}
      />
    </Popover>
  );
};

export default ChatBubble;
