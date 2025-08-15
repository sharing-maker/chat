"use client"
import { type ConversationItem, type MessageItem, SessionType } from "@openim/wasm-client-sdk"
import { useChatContext } from "../../context/ChatContext"
import { useMessage } from "../../hooks/message/useMessage"
import { Avatar, Button, Input, Tooltip } from "antd"
import { Icon } from "../icon"
import { useCallback, useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { useSendMessage } from "../../hooks/message/useSendMessage"

interface MessageListProps {
  conversationId: string
  conversationData: ConversationItem | null
  className?: string
}

const MessageList = (props: MessageListProps) => {
  const { conversationId, conversationData } = props
  const { messageList, refetch } = useMessage(conversationId)
  const scrollRef = useRef<any>(null)
  const shouldScrollToBottomRef = useRef(true)
  const lastMessageCountRef = useRef(messageList?.length || 0)

  const { user } = useChatContext()
  const { sendTextMessage } = useSendMessage({
    recvID: conversationData?.conversationType !== SessionType.Single ? "" : conversationData?.userID || "",
    groupID: conversationData?.conversationType === SessionType.Single ? "" : conversationData?.groupID || "",
  })
  const [textMessage, setTextMessage] = useState("")
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false)

  const scrollToBottom = useCallback((force = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      if (force) {
        shouldScrollToBottomRef.current = true // If forced, ensure auto-scroll is re-enabled
      }
    }
  }, [])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    const SCROLL_UP_THRESHOLD = 200 // If user scrolls up more than 200px from bottom, disable auto-scroll
    const SCROLL_DOWN_THRESHOLD = 5 // If user scrolls within 5px of bottom, re-enable auto-scroll

    if (distanceFromBottom > SCROLL_UP_THRESHOLD) {
      shouldScrollToBottomRef.current = false
    } else if (distanceFromBottom <= SCROLL_DOWN_THRESHOLD) {
      shouldScrollToBottomRef.current = true
    }

    // Show button if not at bottom AND auto-scroll is disabled
    setShowScrollToBottomButton(distanceFromBottom > SCROLL_DOWN_THRESHOLD && !shouldScrollToBottomRef.current)
  }, [])

  const onSendTextMessage = async () => {
    setTextMessage("")
    const res = await sendTextMessage(textMessage)
    if (res) {
      refetch()
    }
  }

  const renderMessageItem = useCallback(
    (message: MessageItem) => {
      const isMine = message?.sendID === user?.userID
      return (
        <div className={clsx("flex", isMine ? "justify-end" : "justify-start")}>
          <div className="flex items-end gap-2">
            {!isMine && <Avatar>{message?.senderNickname?.charAt?.(0) || "A"}</Avatar>}
            <div className="flex flex-col items-start">
              {!isMine && <span className="text-xs text-gray-500 mb-1 px-3">{message?.senderNickname}</span>}
              <div
                className={clsx(
                  "px-3 py-2 sm:px-4 sm:py-2 rounded-2xl max-w-full break-words",
                  isMine ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900",
                )}
              >
                <p className="text-sm sm:text-base whitespace-pre-wrap">
                  {message?.textElem?.content || "Tin nhắn không khả dụng"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    [user?.userID],
  )

  useEffect(() => {
    const currentMessageCount = messageList?.length || 0
    const previousMessageCount = lastMessageCountRef.current

    if (currentMessageCount > previousMessageCount) {
      const newMessages = messageList?.slice(previousMessageCount)
      const hasNewMessageFromCurrentUser = newMessages?.some((msg) => msg.sendID === user?.userID)

      // If current user sent a message, always scroll to bottom
      // If another user sent a message, only scroll if shouldScrollToBottomRef is true (user is already at bottom)
      if (hasNewMessageFromCurrentUser) {
        setTimeout(() => scrollToBottom(true), 50) // Force scroll for own messages
      } else if (shouldScrollToBottomRef.current) {
        setTimeout(() => scrollToBottom(), 50) // Scroll if auto-scroll is enabled for others' messages
      }
    }

    lastMessageCountRef.current = currentMessageCount
  }, [messageList, user?.userID, scrollToBottom])

  return (
    <div className="flex flex-col flex-1 relative h-full bg-white">
      <div className="px-4 py-3 flex items-center border-b gap-3">
        <Avatar src={conversationData?.faceURL}>{conversationData?.showName?.charAt?.(0) || "A"}</Avatar>
        <div className="flex flex-col flex-1">
          <p>{conversationData?.showName || ""}</p>
          <p className="text-xs text-gray-500">{"2 thành viên"}</p>
        </div>
        <Icon icon="align-justify-o" size={28} />
      </div>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="relative h-full h-full">
          <div ref={scrollRef} className="h-full overflow-y-auto p-3 sm:p-4 flex flex-col gap-2">
            {messageList?.map((message) => renderMessageItem(message))}
          </div>
        </div>
      </div>
      <div className="border-t px-4 py-3">
        <div className="border rounded-lg bg-gray-50">
          <div className="px-4 py-3 flex items-center gap-4">
            <Input
              placeholder="Nhập tin nhắn"
              size="small"
              variant="borderless"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSendTextMessage()
                }
              }}
            />
            <Tooltip title="Gửi tin nhắn">
              <Button
                type="primary"
                shape="circle"
                size="middle"
                icon={<Icon icon="send-b" color="white" size={16} />}
                disabled={textMessage.length === 0}
                onClick={onSendTextMessage}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageList
