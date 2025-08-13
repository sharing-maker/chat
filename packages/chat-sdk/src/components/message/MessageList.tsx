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
import { ChevronDown, MessageCircle } from "lucide-react"

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
  const [isLoading, setIsLoading] = useState(false)
  const [newMessageAnimation, setNewMessageAnimation] = useState<string | null>(null)

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
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: force ? "auto" : "smooth",
      })
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

  // Handle new messages with animation
  useEffect(() => {
    const currentMessageCount = messages?.length || 0
    const previousMessageCount = lastMessageCountRef.current

    if (currentMessageCount > previousMessageCount) {
      const newMessages = messages?.slice(previousMessageCount)
      const hasNewMessageFromCurrentUser = newMessages?.some((msg) => msg.sendID === user?.userID)

      // Trigger new message animation
      if (newMessages && newMessages.length > 0) {
        setNewMessageAnimation(newMessages[newMessages.length - 1].clientMsgID)
        setTimeout(() => setNewMessageAnimation(null), 1000)
      }

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
      <div className={`flex items-center justify-center h-full bg-white ${className}`}>
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tin nhắn nào</h3>
          <p className="text-sm text-gray-500">Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-full bg-white ${className}`}>
      {showSwipeHint && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
          <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg animate-fade-in">
            <span>Vuốt phải để quay lại</span>
          </div>
        </div>
      )}

      {showScrollToBottomButton && (
        <div className="absolute bottom-6 right-4 z-10">
          <button
            onClick={() => scrollToBottom(true)}
            className="bg-white text-gray-600 p-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white text-gray-600 text-sm px-4 py-2 rounded-full shadow-md flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải...</span>
          </div>
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
        className="h-full overflow-y-auto px-4 py-6"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
        onScroll={handleScroll}
      >
        <div className="space-y-6">
          {messageGroups.map((group, groupIndex) => (
            <div key={group.date}>
              <DateDivider date={new Date(group.date)} customLabel={formatDateLabel(new Date(group.date))} />
              <div className="space-y-1 mt-4">
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

        {conversationId && (
          <div className="mt-4">
            <TypingIndicator conversationId={conversationId} />
          </div>
        )}

        {/* Bottom padding for better scroll experience */}
        <div className="h-4"></div>
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
