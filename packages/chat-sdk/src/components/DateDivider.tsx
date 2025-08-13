"use client"

interface DateDividerProps {
  date: Date
  customLabel?: string
}

export function DateDivider({ date, customLabel }: DateDividerProps) {
  const formatDate = (date: Date) => {
    if (customLabel) return customLabel

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

  return (
    <div className="flex items-center justify-center my-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-sm opacity-50"></div>
        <div className="relative bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 text-xs font-medium px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
          {formatDate(date)}
        </div>
      </div>
    </div>
  )
}
