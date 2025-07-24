"use client"

import { format, isToday, isYesterday } from "date-fns"

interface DateDividerProps {
  date: Date
  className?: string
}

export function DateDivider({ date, className = "" }: DateDividerProps) {
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return "Today"
    } else if (isYesterday(date)) {
      return "Yesterday"
    } else {
      return format(date, "MMMM d, yyyy")
    }
  }

  return (
    <div className={`flex items-center justify-center my-4 ${className}`}>
      <div className="px-3 py-1 bg-gray-100 rounded-full">
        <span className="text-xs text-gray-600 font-medium">{formatDate(date)}</span>
      </div>
    </div>
  )
}
