"use client";
import type React from "react";
import { Inter } from "next/font/google";
import MainLayout from "@web/components/layouts/MainLayout";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AntdToastProvider } from "@droppii-org/ui";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFetchCurrentUser } from "@web/hook/user/useFetchCurrentUser";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = window.localStorage.getItem("user_token");

    if (token) {
      if (pathname === "/login") {
        router.replace("/chat");
      }
    } else {
      if (pathname !== "/login") {
        router.replace("/login");
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <title>Droppii Chat App</title>
        <link rel="icon" href="/droppii.svg" />
        <meta
          name="description"
          content="Chat with Droppii customer support and more."
        />
        <meta
          name="keywords"
          content="chat, droppii, customer support, messaging"
        />
        <meta property="og:title" content="Droppii Chat App" />
        <meta
          property="og:description"
          content="Chat with Droppii customer support and more."
        />
        <meta property="og:image" content="/droppii.svg" />
        <meta property="og:type" content="website" />
        {/* This line adds the <script> tag to the final HTML */}
        <script src="/wasm_exec.js" />
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <AntdToastProvider>
            <AuthGuard>
              <MainLayout>{children}</MainLayout>
            </AuthGuard>
          </AntdToastProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
