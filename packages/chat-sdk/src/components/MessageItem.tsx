"use client"

import { formatDistanceToNow } from "date-fns"
import type { MessageItemProps } from "../types"

export function MessageItem({
  message,
  isOwn = false,
  showAvatar = true,
  showTimestamp = true,
  className = "",
}: MessageItemProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 ${className}`}>
      <div className={`flex ${isOwn ? "flex-row-reverse" : "flex-row"} items-end space-x-2 max-w-xs lg:max-w-md`}>
        {showAvatar && !isOwn && (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
            B
          </div>
        )}

        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn ? "bg-blue-500 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"
          }`}
        >
          <p className="text-sm">{message.content}</p>
          {showTimestamp && (
            <p className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
