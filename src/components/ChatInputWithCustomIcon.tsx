"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Smile, ImageIcon, Paperclip, Mic, ThumbsUp, Send, Type, Sticker, User } from "lucide-react"
import { VoiceWaveIcon } from "./VoiceWaveIcon"

interface ChatInputProps {
  onSendMessage?: (message: string) => void
  onEmojiClick?: (emoji: string) => void
  onFileUpload?: (file: File) => void
  onImageUpload?: (file: File) => void
  onContactShare?: () => void
  onVoiceRecord?: () => void
  onVoiceMessage?: () => void
  onQuickReact?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ChatInputWithCustomIcon({
  onSendMessage,
  onEmojiClick,
  onFileUpload,
  onImageUpload,
  onContactShare,
  onVoiceRecord,
  onVoiceMessage,
  onQuickReact,
  placeholder = "Nhập tin nhắn",
  disabled = false,
  className = "",
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [showVoiceWave, setShowVoiceWave] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!message.trim() || disabled) return

      onSendMessage?.(message.trim())
      setMessage("")

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    },
    [message, disabled, onSendMessage],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
  }, [])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e as any)
      }
    },
    [handleSubmit],
  )

  const handleFileClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleImageClick = useCallback(() => {
    imageInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileUpload?.(file)
        e.target.value = "" // Reset input
      }
    },
    [onFileUpload],
  )

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onImageUpload?.(file)
        e.target.value = "" // Reset input
      }
    },
    [onImageUpload],
  )

  const handleVoiceRecord = useCallback(() => {
    setIsRecording(!isRecording)
    onVoiceRecord?.()
  }, [isRecording, onVoiceRecord])

  const handleVoiceMessage = useCallback(() => {
    setShowVoiceWave(!showVoiceWave)
    onVoiceMessage?.()
  }, [showVoiceWave, onVoiceMessage])

  return (
    <div className={`bg-white border-t border-gray-200 p-3 sm:p-4 ${className}`}>
      {/* Main Input Container */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Input Field */}
        <div className="px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full bg-transparent border-none outline-none resize-none text-sm sm:text-base text-gray-900 placeholder-gray-500 leading-5"
                rows={1}
                style={{
                  minHeight: "20px",
                  maxHeight: "120px",
                }}
              />
            </div>

            {/* Send Button or Quick React */}
            {message.trim() ? (
              <button
                type="submit"
                disabled={disabled}
                className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onQuickReact}
                className="flex-shrink-0 p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors duration-200"
                aria-label="Quick react"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Action Icons Row */}
        <div className="px-4 pb-3 border-t border-gray-100">
          <div className="flex items-center justify-between space-x-1">
            {/* Text Style */}
            <button
              onClick={() => console.log("Text style clicked")}
              disabled={disabled}
              className="p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-blue-500"
              aria-label="Text style"
              title="Text style"
            >
              <Type className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Emoji */}
            <button
              onClick={() => onEmojiClick?.("😊")}
              disabled={disabled}
              className="p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-yellow-500"
              aria-label="Emoji"
              title="Emoji"
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Sticker */}
            <button
              onClick={() => console.log("Sticker clicked")}
              disabled={disabled}
              className="p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-purple-500"
              aria-label="Sticker"
              title="Sticker"
            >
              <Sticker className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Image Upload */}
            <button
              onClick={handleImageClick}
              disabled={disabled}
              className="p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-green-500"
              aria-label="Image upload"
              title="Image upload"
            >
              <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* File Attachment */}
            <button
              onClick={handleFileClick}
              disabled={disabled}
              className="p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-blue-500"
              aria-label="File attachment"
              title="File attachment"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Contact Sharing */}
            <button
              onClick={onContactShare}
              disabled={disabled}
              className="p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-indigo-500"
              aria-label="Contact sharing"
              title="Contact sharing"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Record Audio */}
            <button
              onClick={handleVoiceRecord}
              disabled={disabled}
              className={`
                p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-gray-100 active:scale-95
                ${isRecording ? "text-red-500 bg-red-50" : "text-gray-500 hover:text-red-500"}
              `}
              aria-label="Record audio"
              title="Record audio"
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Voice Message */}
            <button
              onClick={handleVoiceMessage}
              disabled={disabled}
              className={`
                p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-gray-100 active:scale-95
                ${showVoiceWave ? "text-blue-500 bg-blue-50" : "text-gray-500 hover:text-blue-500"}
              `}
              aria-label="Voice message"
              title="Voice message"
            >
              <VoiceWaveIcon className="w-4 h-4 sm:w-5 sm:h-5" animated={showVoiceWave} />
            </button>
          </div>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="px-4 pb-2">
            <div className="flex items-center space-x-2 text-red-500 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Recording...</span>
            </div>
          </div>
        )}

        {/* Voice Wave Indicator */}
        {showVoiceWave && (
          <div className="px-4 pb-2">
            <div className="flex items-center space-x-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-blue-500 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
      />
      <input ref={imageInputRef} type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
    </div>
  )
}
