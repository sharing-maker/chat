"use client"
import { useChatContext } from "../context/ChatContext"
import type { MessageItemProps, DisplayMessage, Message } from "../types"
import { FileText, Download, Check, CheckCheck } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"

export function MessageItem({ message, isOwn, showAvatar = true, showTimestamp = true }: MessageItemProps) {
  const { state } = useChatContext()
  const sender = state.users[message.senderId]

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Check className="w-3 h-3" />
      case "delivered":
        return <CheckCheck className="w-3 h-3" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      default:
        return null
    }
  }

  const renderTextMessage = (msg: DisplayMessage) => {
    const content = msg.text || ""
    // Simple regex to detect URLs and make them clickable
    const linkRegex = /(https?:\/\/[^\s]+)/g
    const parts = content.split(linkRegex)

    return (
      <div
        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-2xl max-w-full break-words ${
          isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="text-sm sm:text-base whitespace-pre-wrap">
          {parts.map((part, index) =>
            linkRegex.test(part) ? (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-200 hover:text-blue-100"
              >
                {part}
              </a>
            ) : (
              part
            ),
          )}
        </p>
        {isOwn && getStatusIcon()}
      </div>
    )
  }

  const renderMediaMessage = (msg: DisplayMessage) => {
    const imageAttachments = msg.attachments?.filter((att) => att.type === "image") || []

    return (
      <div className={`flex flex-col gap-2 ${isOwn ? "items-end" : "items-start"}`}>
        {msg.text && (
          <div
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-2xl max-w-full break-words ${
              isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            <p className="text-sm sm:text-base whitespace-pre-wrap">{msg.text}</p>
            {isOwn && getStatusIcon()}
          </div>
        )}
        <div className={`grid gap-2 ${imageAttachments.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {msg.attachments?.map((attachment, idx) => (
            <div key={idx} className={`relative rounded-lg overflow-hidden ${isOwn ? "bg-blue-100" : "bg-gray-100"}`}>
              {attachment.type === "image" ? (
                <>
                  <Image
                    src={attachment.url || "/placeholder.svg"}
                    alt={attachment.name || "Attached image"}
                    width={200}
                    height={150}
                    className="w-full h-auto object-cover cursor-pointer"
                    onClick={() =>
                      message.onImageClick?.(
                        attachment.id,
                        imageAttachments.map((img) => ({ id: img.id, url: img.url, name: img.name })),
                      )
                    }
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium p-1 rounded bg-black/50">Xem ảnh</span>
                  </div>
                </>
              ) : (
                <a
                  href={attachment.url}
                  download={attachment.name}
                  className="flex items-center p-3 space-x-2 text-gray-800 hover:bg-gray-200 transition-colors"
                >
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-medium truncate">{attachment.name || "File"}</span>
                    <span className="block text-xs text-gray-500">
                      {attachment.size ? formatFileSize(attachment.size) : "Unknown size"}
                    </span>
                  </div>
                  <Download className="w-4 h-4 flex-shrink-0 text-gray-600" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderPromoMessage = (msg: DisplayMessage) => {
    if (!msg.promoData) return null
    const { imageUrl, title, description, buttonText, buttonUrl } = msg.promoData

    return (
      <div className="w-full max-w-xs mx-auto my-2 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="relative w-full h-32 bg-gray-200">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-lg"
          />
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <a
            href={buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            {buttonText}
          </a>
        </div>
      </div>
    )
  }

  const renderImageMessage = (msg: Message) => {
    return (
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div>
          <img src={msg.content || "/placeholder.svg"} alt="Shared image" className="rounded max-w-full h-auto" />
          {msg.caption && <p className="text-sm mt-2">{msg.caption}</p>}
        </div>
        {showTimestamp && <span className="text-xs text-gray-500 mt-1">{format(msg.timestamp, "HH:mm")}</span>}
      </div>
    )
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        {showAvatar && !isOwn && (
          <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
            {sender.avatar ? (
              <img
                src={sender.avatar || "/placeholder.svg"}
                alt={sender.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-gray-600">{sender.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
        )}

        <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
          {!isOwn && <span className="text-xs text-gray-500 mb-1">{sender.name}</span>}

          {message.type === "text" && renderTextMessage(message)}
          {message.type === "media" && renderMediaMessage(message)}
          {message.type === "promo" && renderPromoMessage(message)}
          {message.type === "image" && renderImageMessage(message)}
        </div>
      </div>
    </div>
  )
}
