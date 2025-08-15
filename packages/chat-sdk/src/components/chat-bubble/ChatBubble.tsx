"use client"
import { useState } from "react"
import { FloatButton, Drawer } from "antd"
import { MessageOutlined, CloseOutlined } from "@ant-design/icons"
import MessageList from "../message/MessageList"
import type { ConversationItem } from "@openim/wasm-client-sdk"

interface ChatBubbleProps {
  conversationId: string
  conversationData: ConversationItem | null
  className?: string
}

const ChatBubble = ({ conversationId, conversationData, className }: ChatBubbleProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

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
        title="Chat"
        placement="right"
        onClose={() => setIsOpen(false)}
        open={isOpen}
        width={400}
        height={600}
        style={{
          position: "fixed",
          right: 24,
          bottom: 100,
          borderRadius: "12px",
        }}
        styles={{
          body: { padding: 0, height: "100%" },
          header: { padding: "12px 16px", borderBottom: "1px solid #f0f0f0" },
        }}
        mask={false}
        destroyOnClose={false}
      >
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <MessageList conversationId={conversationId} conversationData={conversationData} className="flex-1" />
        </div>
      </Drawer>
    </>
  )
}

export default ChatBubble
