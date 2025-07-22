"use client"

import { useEffect } from "react"
import { useChatContext } from "../context/ChatContext"

export function useMessages(conversationId: string | null) {
  const { state, dispatch } = useChatContext()

  useEffect(() => {
    // Load messages for conversation if not already loaded
    if (conversationId && !state.messages[conversationId] && state.config?.token) {
      // For demo, add some mock messages with different types
      const mockMessages = [
        // Older messages (yesterday)
        {
          id: "old-1",
          conversationId,
          senderId: "user-2",
          content: "Hey! How was your weekend?",
          type: "text" as const,
          timestamp: new Date(Date.now() - 86400000 - 3600000), // Yesterday, 1 hour earlier
          status: "read" as const,
        },
        {
          id: "old-2",
          conversationId,
          senderId: state.config.userId,
          content: "It was great! Went hiking with friends 🏔️",
          type: "text" as const,
          timestamp: new Date(Date.now() - 86400000 - 3000000), // Yesterday, 50 minutes earlier
          status: "read" as const,
        },
        {
          id: "old-3",
          conversationId,
          senderId: state.config.userId,
          content: "Here are some photos from the trip!",
          type: "image" as const,
          timestamp: new Date(Date.now() - 86400000 - 2700000), // Yesterday, 45 minutes earlier
          status: "read" as const,
          attachments: [
            {
              id: "att-old-1",
              name: "mountain1.jpg",
              url: "/placeholder.svg?height=300&width=400",
              type: "image/jpeg",
              size: 245760,
            },
            {
              id: "att-old-2",
              name: "mountain2.jpg",
              url: "/placeholder.svg?height=300&width=400",
              type: "image/jpeg",
              size: 198432,
            },
          ],
        },
        {
          id: "old-4",
          conversationId,
          senderId: "user-2",
          content: "Wow, those are amazing! 😍 The view is incredible!",
          type: "text" as const,
          timestamp: new Date(Date.now() - 86400000 - 2400000), // Yesterday, 40 minutes earlier
          status: "read" as const,
        },

        // Today's messages
        {
          id: "1",
          conversationId,
          senderId: "user-2",
          content: "Hey there! How are you doing today? 😊",
          type: "text" as const,
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          status: "read" as const,
        },
        {
          id: "2",
          conversationId,
          senderId: state.config.userId,
          content: "I'm doing great! Thanks for asking. How about you?",
          type: "text" as const,
          timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
          status: "read" as const,
        },
        {
          id: "3",
          conversationId,
          senderId: "user-2",
          content: "I'm good too! By the way, check out this cool website: https://example.com",
          type: "text" as const,
          timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
          status: "read" as const,
        },
        {
          id: "4",
          conversationId,
          senderId: state.config.userId,
          content: "Look at this beautiful sunset!",
          type: "image" as const,
          timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
          status: "read" as const,
          attachments: [
            {
              id: "att-1",
              name: "sunset.jpg",
              url: "/placeholder.svg?height=300&width=400",
              type: "image/jpeg",
              size: 245760,
            },
          ],
        },
        {
          id: "5",
          conversationId,
          senderId: "user-2",
          content: "Here's the document you requested",
          type: "file" as const,
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          status: "read" as const,
          attachments: [
            {
              id: "att-2",
              name: "project-proposal.pdf",
              url: "/placeholder.svg?height=200&width=200",
              type: "application/pdf",
              size: 1024000,
            },
          ],
        },
        {
          id: "6",
          conversationId,
          senderId: state.config.userId,
          content: "Photos from my vacation 📸",
          type: "image" as const,
          timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
          status: "read" as const,
          attachments: [
            {
              id: "att-3",
              name: "beach1.jpg",
              url: "/placeholder.svg?height=200&width=300",
              type: "image/jpeg",
              size: 180000,
            },
            {
              id: "att-4",
              name: "beach2.jpg",
              url: "/placeholder.svg?height=200&width=300",
              type: "image/jpeg",
              size: 195000,
            },
          ],
        },
        {
          id: "7",
          conversationId,
          senderId: "user-2",
          content: "Wow, those photos are amazing! 🏖️",
          type: "text" as const,
          timestamp: new Date(Date.now() - 600000), // 10 minutes ago
          status: "read" as const,
        },
        {
          id: "8",
          conversationId,
          senderId: state.config.userId,
          content: "Thanks! The weather was perfect 🌞",
          type: "text" as const,
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
          status: "read" as const,
        },
        {
          id: "9",
          conversationId,
          senderId: "user-2",
          content: "I'm so jealous! I need a vacation too 😅",
          type: "text" as const,
          timestamp: new Date(Date.now() - 60000), // 1 minute ago
          status: "delivered" as const,
        },
      ]

      dispatch({
        type: "SET_MESSAGES",
        payload: { conversationId, messages: mockMessages },
      })
    }
  }, [conversationId, state.messages, state.config, dispatch])

  return {
    messages: conversationId ? state.messages[conversationId] || [] : [], // Ensure always returns array
    isLoading: false,
  }
}
