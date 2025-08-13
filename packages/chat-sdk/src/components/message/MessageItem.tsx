"use client"

import { useChatContext } from "../../context/ChatContext"
import type { MessageItem as OpenIMMessage } from "@openim/wasm-client-sdk"
import { FileText, Download, MapPin, Video } from "lucide-react"
import Image from "next/image"

interface MessageItemProps {
  message: OpenIMMessage
  isGrouped?: boolean
  onImageClick?: (imageId: string, images: { id: string; url: string; name?: string }[]) => void
}

export function MessageItem({ message, isGrouped = false, onImageClick }: MessageItemProps) {
  const { user } = useChatContext()
  const isOwnMessage = message.sendID === user?.userID

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getMessageStatus = () => {
    switch (message.status) {
      case 1: // Sending
        return (
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        )
      case 2: // Sent
        return (
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        )
      case 3: // Delivered
        return (
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
          </svg>
        )
      default:
        return null
    }
  }

  // Render text message
  const renderTextMessage = () => {
    const content = message.textElem?.content || ""
    const linkRegex = /(https?:\/\/[^\s]+)/g
    const parts = content.split(linkRegex)

    return (
      <div
        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-2xl max-w-full break-words ${
          isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
        } ${isGrouped ? (isOwnMessage ? "rounded-tr-md" : "rounded-tl-md") : ""}`}
      >
        <p className="text-sm sm:text-base whitespace-pre-wrap">
          {parts.map((part, index) =>
            linkRegex.test(part) ? (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${isOwnMessage ? "text-blue-200 hover:text-blue-100" : "text-blue-600 hover:text-blue-800"}`}
              >
                {part}
              </a>
            ) : (
              part
            ),
          )}
        </p>
      </div>
    )
  }

  // Render image message
  const renderImageMessage = () => {
    const imageElem = message.pictureElem
    if (!imageElem) return null

    const imageUrl = imageElem.sourcePicture?.url || imageElem.bigPicture?.url || imageElem.snapshotPicture?.url
    if (!imageUrl) return null

    return (
      <div className="relative rounded-lg overflow-hidden max-w-xs">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Image message"
          width={imageElem.sourcePicture?.width || 200}
          height={imageElem.sourcePicture?.height || 150}
          className="w-full h-auto object-cover cursor-pointer"
          onClick={() =>
            onImageClick?.(message.clientMsgID, [{ id: message.clientMsgID, url: imageUrl, name: "Image" }])
          }
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-white text-xs font-medium p-1 rounded bg-black/50">Xem ảnh</span>
        </div>
      </div>
    )
  }

  // Render video message
  const renderVideoMessage = () => {
    const videoElem = message.videoElem
    if (!videoElem) return null

    return (
      <div className="relative rounded-lg overflow-hidden max-w-xs bg-black">
        <video src={videoElem.videoUrl} poster={videoElem.snapshotUrl} controls className="w-full h-auto" />
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          <Video className="w-3 h-3 inline mr-1" />
          {Math.floor(videoElem.duration / 60)}:{(videoElem.duration % 60).toString().padStart(2, "0")}
        </div>
      </div>
    )
  }

  // Render audio message
  const renderAudioMessage = () => {
    const soundElem = message.soundElem
    if (!soundElem) return null

    return (
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl ${
          isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="flex-shrink-0">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </div>
        <div className="flex-1">
          <audio src={soundElem.sourceUrl} controls className="w-full" />
        </div>
        <div className="text-xs opacity-75">{soundElem.duration}s</div>
      </div>
    )
  }

  // Render file message
  const renderFileMessage = () => {
    const fileElem = message.fileElem
    if (!fileElem) return null

    return (
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl max-w-xs ${
          isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <FileText className="w-6 h-6 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{fileElem.fileName}</p>
          <p className="text-xs opacity-75">{formatFileSize(fileElem.fileSize)}</p>
        </div>
        <a href={fileElem.sourceUrl} download={fileElem.fileName} className="flex-shrink-0 hover:opacity-75">
          <Download className="w-4 h-4" />
        </a>
      </div>
    )
  }

  // Render location message
  const renderLocationMessage = () => {
    const locationElem = message.locationElem
    if (!locationElem) return null

    return (
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl max-w-xs ${
          isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <MapPin className="w-6 h-6 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{locationElem.description}</p>
          <p className="text-xs opacity-75">
            {locationElem.latitude}, {locationElem.longitude}
          </p>
        </div>
      </div>
    )
  }

  // Render quote message
  const renderQuoteMessage = () => {
    const quoteElem = message.quoteElem
    if (!quoteElem) return null

    return (
      <div className={`space-y-2 ${isOwnMessage ? "items-end" : "items-start"}`}>
        {/* Quoted message */}
        <div
          className={`px-3 py-2 rounded-lg border-l-4 ${
            isOwnMessage ? "bg-blue-400 border-blue-200 text-white" : "bg-gray-50 border-gray-300 text-gray-700"
          }`}
        >
          <p className="text-xs opacity-75 mb-1">{quoteElem.quoteMessage?.senderNickname}</p>
          <p className="text-sm">{quoteElem.text}</p>
        </div>

        {/* Current message */}
        <div
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-2xl ${
            isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          <p className="text-sm sm:text-base whitespace-pre-wrap">{quoteElem.text}</p>
        </div>
      </div>
    )
  }

  // Render business card message
  const renderCardMessage = () => {
    const cardElem = message.cardElem
    if (!cardElem) return null

    return (
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl max-w-xs ${
          isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium">{cardElem.nickname?.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{cardElem.nickname}</p>
          <p className="text-xs opacity-75">Business Card</p>
        </div>
      </div>
    )
  }

  const renderMessageContent = () => {
    switch (message.contentType) {
      case 101: // Text
        return renderTextMessage()
      case 102: // Image
        return renderImageMessage()
      case 103: // Audio
        return renderAudioMessage()
      case 104: // Video
        return renderVideoMessage()
      case 105: // File
        return renderFileMessage()
      case 106: // Quote
        return renderQuoteMessage()
      case 107: // Business Card
        return renderCardMessage()
      case 110: // Location
        return renderLocationMessage()
      default:
        return (
          <div
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-2xl ${
              isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            <p className="text-sm italic opacity-75">Unsupported message type</p>
          </div>
        )
    }
  }

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} ${
        isGrouped ? "mt-0.5 sm:mt-1" : "mt-3 sm:mt-4"
      }`}
    >
      <div
        className={`flex items-end space-x-2 max-w-[85%] sm:max-w-xs lg:max-w-md ${
          isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {!isOwnMessage && !isGrouped && (
          <img
            src={message.senderFaceUrl || "/placeholder.svg?height=32&width=32&query=user"}
            alt={message.senderNickname || "User"}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
          />
        )}

        {!isOwnMessage && isGrouped && (
          <div className="w-6 sm:w-8 flex-shrink-0" /> // Spacer for grouped messages
        )}

        <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
          {!isGrouped && !isOwnMessage && (
            <span className="text-xs text-gray-500 mb-1 px-3">{message.senderNickname || "Unknown User"}</span>
          )}

          {renderMessageContent()}

          <div
            className={`flex items-center space-x-1 mt-1 px-2 ${
              isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <span className="text-xs text-gray-500">{formatTime(message.sendTime)}</span>
            {isOwnMessage && getMessageStatus()}
          </div>
        </div>
      </div>
    </div>
  )
}
