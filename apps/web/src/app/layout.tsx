import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ChatProvider } from "@droppii-org/chat-sdk"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chat SDK Demo",
  description: "A modern React Chat SDK demonstration",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ChatProvider userId="current-user" token="demo-token" websocketUrl="demo" enableWebSocket={false}>
        <body className={inter.className}>{children}</body>
      </ChatProvider>
    </html>
  )
}
