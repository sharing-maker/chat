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
    <div className="flex items-center justify-center my-3 sm:my-4">
      <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full">{formatDate(date)}</div>
    </div>
  )
}
