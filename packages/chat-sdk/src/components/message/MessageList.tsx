"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MessageItem } from "./MessageItem"
import { DateDivider } from "../DateDivider"
import { TypingIndicator } from "../TypingIndicator"
import { useSwipeGesture } from "../../hooks/useSwipeGesture"
import { ImagePreviewModal } from "../ImagePreviewModal"
import useMessage from "../../hooks/message/useMessage"
import { useChatContext } from "../../context/ChatContext"
import type { MessageItem as MessageItemType } from "@openim/wasm-client-sdk"

interface MessageListProps {
  conversationId: string
  className?: string
}

const MessageList = ({ conversationId, className }: MessageListProps) => {
  const scrollRef = useRef<any>(null)
  const shouldScrollToBottomRef = useRef(true)
  const { user } = useChatContext() || {}
  const { messageList: messages } = useMessage(conversationId)
  const lastMessageCountRef = useRef(messages?.length || 0)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false)

  // State for ImagePreviewModal
  const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false)
  const [previewImages, setPreviewImages] = useState<{ id: string; url: string; name?: string }[]>([])
  const [initialPreviewImageId, setInitialPreviewImageId] = useState("")

  // Swipe gesture for going back (secondary swipe area)
  const messageSwipeRef = useSwipeGesture({
    onSwipeRight: () => {
      if (window.innerWidth < 768) {
        setShowSwipeHint(true)
        setTimeout(() => setShowSwipeHint(false), 1500)
      }
    },
    threshold: 80,
    restraint: 120,
    allowedTime: 400,
    enabled: true,
  }) as any

  // Auto-scroll to bottom logic
  const scrollToBottom = useCallback((force = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      if (force) {
        shouldScrollToBottomRef.current = true
      }
    }
  }, [])

  // Handle scroll events to manage auto-scroll behavior and button visibility
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    const SCROLL_UP_THRESHOLD = 200
    const SCROLL_DOWN_THRESHOLD = 5

    if (distanceFromBottom > SCROLL_UP_THRESHOLD) {
      shouldScrollToBottomRef.current = false
    } else if (distanceFromBottom <= SCROLL_DOWN_THRESHOLD) {
      shouldScrollToBottomRef.current = true
    }

    setShowScrollToBottomButton(distanceFromBottom > SCROLL_DOWN_THRESHOLD && !shouldScrollToBottomRef.current)
  }, [])

  // Handle new messages
  useEffect(() => {
    const currentMessageCount = messages?.length || 0
    const previousMessageCount = lastMessageCountRef.current

    if (currentMessageCount > previousMessageCount) {
      const newMessages = messages?.slice(previousMessageCount)
      const hasNewMessageFromCurrentUser = newMessages?.some((msg) => msg.sendID === user?.userID)

      if (hasNewMessageFromCurrentUser) {
        setTimeout(() => scrollToBottom(true), 50)
      } else if (shouldScrollToBottomRef.current) {
        setTimeout(() => scrollToBottom(), 50)
      }
    }

    lastMessageCountRef.current = currentMessageCount
  }, [messages, user?.userID, scrollToBottom])

  // Attach and detach scroll listener
  useEffect(() => {
    const currentScrollRef = scrollRef.current
    if (currentScrollRef) {
      currentScrollRef.addEventListener("scroll", handleScroll)
      handleScroll()
    }

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener("scroll", handleScroll)
      }
    }
  }, [handleScroll])

  // Show swipe hint on first load for mobile users
  useEffect(() => {
    const hasSeenHint = localStorage.getItem("chat-swipe-hint-seen")
    if (!hasSeenHint && window.innerWidth < 768) {
      setTimeout(() => {
        setShowSwipeHint(true)
        setTimeout(() => {
          setShowSwipeHint(false)
          localStorage.setItem("chat-swipe-hint-seen", "true")
        }, 3000)
      }, 1000)
    }
  }, [])

  // Group messages by date
  const groupMessagesByDate = useCallback(() => {
    const groups: { date: string; messages: MessageItemType[] }[] = []
    let currentDate = ""
    let currentGroup: MessageItemType[] = []

    messages?.forEach((message) => {
      const messageDate = new Date(message.sendTime).toDateString()

      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup })
        }
        currentDate = messageDate
        currentGroup = [message]
      } else {
        currentGroup.push(message)
      }
    })

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup })
    }

    return groups
  }, [messages])

  const messageGroups = groupMessagesByDate()

  // Format date labels in Vietnamese
  const formatDateLabel = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (messageDate.getTime() === today.getTime()) {
      return "Hôm nay"
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return "Hôm qua"
    } else {
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  // Handler for image clicks from MessageItem
  const handleImageClick = useCallback((imageId: string, images: { id: string; url: string; name?: string }[]) => {
    setPreviewImages(images)
    setInitialPreviewImageId(imageId)
    setIsImagePreviewModalOpen(true)
  }, [])

  if (!messages || messages.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-sm">Chưa có tin nhắn nào</p>
          <p className="text-xs text-gray-400 mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-full ${className}`}>
      {/* Swipe hint overlay */}
      {showSwipeHint && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
          <div className="bg-black bg-opacity-80 text-white text-sm px-4 py-2 rounded-full flex items-center space-x-2 animate-pulse">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Vuốt phải để quay lại</span>
          </div>
        </div>
      )}

      {/* Scroll to bottom button */}
      {showScrollToBottomButton && (
        <div className="absolute bottom-20 right-4 z-10">
          <button
            onClick={() => scrollToBottom(true)}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            aria-label="Scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Scrollable message container */}
      <div
        ref={(el) => {
          scrollRef.current = el
          if (messageSwipeRef.current !== el) {
            messageSwipeRef.current = el as HTMLElement
          }
        }}
        className="h-full overflow-y-auto p-3 sm:p-4"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
        onScroll={handleScroll}
      >
        {/* Message groups */}
        <div className="space-y-3 sm:space-y-4">
          {messageGroups.map((group, groupIndex) => (
            <div key={group.date}>
              <DateDivider date={new Date(group.date)} customLabel={formatDateLabel(new Date(group.date))} />
              <div className="space-y-1 sm:space-y-2">
                {group.messages.map((message, messageIndex) => {
                  const prevMessage = messageIndex > 0 ? group.messages[messageIndex - 1] : null
                  const isGrouped =
                    prevMessage?.sendID === message.sendID &&
                    new Date(message.sendTime).getTime() - new Date(prevMessage.sendTime).getTime() < 300000 // 5 minutes

                  return (
                    <MessageItem
                      key={message.clientMsgID}
                      message={message}
                      isGrouped={isGrouped}
                      onImageClick={handleImageClick}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Typing indicator */}
        {conversationId && <TypingIndicator conversationId={conversationId} />}
      </div>

      {/* Image Preview Modal */}
      {isImagePreviewModalOpen && (
        <ImagePreviewModal
          images={previewImages}
          initialImageId={initialPreviewImageId}
          onClose={() => setIsImagePreviewModalOpen(false)}
        />
      )}
    </div>
  )
}

export default MessageList
