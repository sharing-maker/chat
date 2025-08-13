import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ChatProvider } from "@droppii-org/chat-sdk";
import MainLayout from "@web/components/layouts/MainLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Droppii Chat Management",
  description: "Chat management system for Droppii",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* This line adds the <script> tag to the final HTML */}
        <script src="/wasm_exec.js" />
      </head>
      <body className={inter.className}>
        <ChatProvider
          config={{
            userID: "user-123",
            platformID: 1, // Use number for platform ID
            apiAddr: "http://localhost:3000",
            wsAddr: "ws://localhost:3000",
            token: "demo-token",
          }}
        >
          <MainLayout>{children}</MainLayout>
        </ChatProvider>
      </body>
    </html>
  );
}
