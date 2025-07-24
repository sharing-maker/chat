"use client"

import { useCallback, useRef } from "react"

export function useTyping(conversationId: string) {
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const startTyping = useCallback(() => {
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // In a real implementation, you'd emit a typing event here
    console.log(`Started typing in conversation ${conversationId}`)

    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 3000)
  }, [conversationId])

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // In a real implementation, you'd emit a stop typing event here
    console.log(`Stopped typing in conversation ${conversationId}`)
  }, [conversationId])

  return {
    startTyping,
    stopTyping,
  }
}
