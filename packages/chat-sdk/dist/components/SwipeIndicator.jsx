"use client";
import { useEffect, useState } from "react";
export function SwipeIndicator({ show, direction, text, className = "" }) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        if (show) {
            setIsVisible(true);
        }
        else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [show]);
    if (!isVisible)
        return null;
    return (<div className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
        bg-black bg-opacity-80 text-white px-4 py-3 rounded-lg
        flex items-center space-x-2 transition-all duration-300
        ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        ${className}
      `}>
      <svg className={`w-5 h-5 ${direction === "left" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
      </svg>
      <span className="text-sm font-medium">{text}</span>
    </div>);
}
