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
import { ChevronDown, MessageCircle, Sparkles } from "lucide-react"

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
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có tin nhắn nào</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Hãy bắt đầu cuộc trò chuyện! Gửi tin nhắn đầu tiên để kết nối với mọi người.
          </p>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            <span>Sẵn sàng để trò chuyện</span>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-full bg-gradient-to-b from-gray-50/30 to-white ${className}`}>
      {showSwipeHint && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm px-6 py-3 rounded-full flex items-center space-x-3 shadow-lg animate-bounce">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="font-medium">Vuốt phải để quay lại</span>
          </div>
        </div>
      )}

      {showScrollToBottomButton && (
        <div className="absolute bottom-20 right-4 z-10">
          <button
            onClick={() => scrollToBottom(true)}
            className="group bg-white text-gray-700 p-3 rounded-full shadow-lg border border-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 transform hover:scale-105"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white/90 backdrop-blur-sm text-gray-600 text-sm px-4 py-2 rounded-full shadow-md flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải tin nhắn...</span>
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
        className="h-full overflow-y-auto p-4 sm:p-6"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
        onScroll={handleScroll}
      >
        <div className="space-y-6">
          {messageGroups.map((group, groupIndex) => (
            <div key={group.date} className="animate-fade-in">
              <DateDivider date={new Date(group.date)} customLabel={formatDateLabel(new Date(group.date))} />
              <div className="space-y-2 mt-4">
                {group.messages.map((message, messageIndex) => {
                  const prevMessage = messageIndex > 0 ? group.messages[messageIndex - 1] : null
                  const isGrouped =
                    prevMessage?.sendID === message.sendID &&
                    new Date(message.sendTime).getTime() - new Date(prevMessage.sendTime).getTime() < 300000 // 5 minutes

                  return (
                    <div
                      key={message.clientMsgID}
                      className={`transform transition-all duration-300 ${
                        newMessageAnimation === message.clientMsgID ? "animate-slide-up scale-105" : "animate-fade-in"
                      }`}
                    >
                      <MessageItem message={message} isGrouped={isGrouped} onImageClick={handleImageClick} />
                    </div>
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
