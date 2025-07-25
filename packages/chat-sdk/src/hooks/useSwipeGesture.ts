"use client"

import { useEffect, useRef, useCallback } from "react"

interface SwipeGestureOptions {
  onSwipeRight?: () => void
  onSwipeLeft?: () => void
  threshold?: number
  restraint?: number
  allowedTime?: number
  enabled?: boolean
}

export function useSwipeGesture({
  onSwipeRight,
  onSwipeLeft,
  threshold = 100,
  restraint = 100,
  allowedTime = 300,
  enabled = true,
}: SwipeGestureOptions) {
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const touchStartTime = useRef<number>(0)
  const elementRef = useRef<HTMLElement>(null)

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return

      const touch = e.touches[0]
      touchStartX.current = touch.clientX
      touchStartY.current = touch.clientY
      touchStartTime.current = Date.now()
    },
    [enabled],
  )

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return

      const touch = e.changedTouches[0]
      const touchEndX = touch.clientX
      const touchEndY = touch.clientY
      const touchEndTime = Date.now()

      const distanceX = touchEndX - touchStartX.current
      const distanceY = touchEndY - touchStartY.current
      const elapsedTime = touchEndTime - touchStartTime.current

      // Check if the swipe meets our criteria
      if (elapsedTime <= allowedTime) {
        // Check if horizontal distance is sufficient and vertical distance is within restraint
        if (Math.abs(distanceX) >= threshold && Math.abs(distanceY) <= restraint) {
          if (distanceX > 0) {
            // Swipe right
            onSwipeRight?.()
          } else {
            // Swipe left
            onSwipeLeft?.()
          }
        }
      }
    },
    [enabled, threshold, restraint, allowedTime, onSwipeRight, onSwipeLeft],
  )

  useEffect(() => {
    const element = elementRef.current
    if (!element || !enabled) return

    // Add passive event listeners for better performance
    element.addEventListener("touchstart", handleTouchStart, { passive: true })
    element.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchEnd, enabled])

  return elementRef
}
