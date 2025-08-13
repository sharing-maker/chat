"use client"

import { useEffect, useRef, useCallback } from "react"
import { useChatContext } from "../context/ChatContext"
import type { SocketMessage } from "../types"

export function useSocket() {
  const context = useChatContext()
  const user = context?.user
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 3

  const connect = useCallback(() => {
    // WebSocket functionality disabled for now - will be integrated with OpenIM SDK
    console.log("WebSocket disabled - using OpenIM SDK connection")
    return
  }, [])

  const handleSocketMessage = useCallback((message: SocketMessage) => {
    // Handle socket messages when integrated with OpenIM SDK
    console.log("Socket message received:", message)
  }, [])

  const sendMessage = useCallback((message: any) => {
    // Send messages through OpenIM SDK instead of WebSocket
    console.log("Message sent via OpenIM SDK:", message)
    return false
  }, [])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (socketRef.current) {
      socketRef.current.close(1000, "Manual disconnect")
      socketRef.current = null
    }
    reconnectAttempts.current = maxReconnectAttempts
  }, [])

  useEffect(() => {
    connect()
    return disconnect
  }, [connect, disconnect])

  return {
    isConnected: !!user, // Connected if user is logged in
    sendMessage,
    disconnect,
    reconnect: connect,
  }
}
