"use client";
import type React from "react";
import { Inter } from "next/font/google";
import MainLayout from "@web/components/layouts/MainLayout";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

// Create a client
const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          <MainLayout>{children}</MainLayout>
        </QueryClientProvider>
      </body>
    </html>
  );
}
