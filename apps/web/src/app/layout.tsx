import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
