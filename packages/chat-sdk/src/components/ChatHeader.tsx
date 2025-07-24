"use client"

import { MoreVertical, Phone, Video } from "lucide-react"

interface ChatHeaderProps {
  conversationId: string
  title?: string
  subtitle?: string
  avatar?: string
  isOnline?: boolean
  className?: string
}

export function ChatHeader({
  conversationId,
  title = "Support Chat",
  subtitle = "Online",
  avatar,
  isOnline = true,
  className = "",
}: ChatHeaderProps) {
  return (
    <div className={`flex items-center justify-between p-4 border-b bg-white ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {avatar ? (
              <img src={avatar || "/placeholder.svg"} alt={title} className="w-full h-full rounded-full object-cover" />
            ) : (
              title.charAt(0).toUpperCase()
            )}
          </div>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Phone className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Video className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  )
}
