"use client";
import type React from "react";
import { Inter } from "next/font/google";
import MainLayout from "@web/components/layouts/MainLayout";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AntdToastProvider } from "@droppii-org/ui";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useUserStore from "@web/hook/user/useUserStore";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB0BjcMwhRpRb2AgwzcHZxYLfxm1LPrxg8",
  authDomain: "droppii-crm.firebaseapp.com",
  projectId: "droppii-crm",
  storageBucket: "droppii-crm.firebasestorage.app",
  messagingSenderId: "406416850803",
  appId: "1:406416850803:web:0194f91ca7efe996924f06",
  measurementId: "G-3X92Z7RE5X",
}; // @TODO: Move to environment variables

// Initialize Firebase
const app = initializeApp(firebaseConfig);
isSupported().then((yes) => {
  if (yes) {
    const analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized");
  } else {
    console.log("Analytics not supported in this environment");
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("SW registered:", registration);
    })
    .catch((err) => console.error("SW registration failed:", err));
}

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setToken = useUserStore((state) => state.setAccessToken);
  const token = useUserStore((state) => state.accessToken);

  useEffect(() => {
    const token = window.localStorage.getItem("user_token") || "";

    if (!token && pathname !== "/login") {
      router.push("/login");
      return;
    }

    if (token && (pathname === "/login" || pathname === "/")) {
      router.push("/chat");
    }
  }, [pathname, router, setToken, token]);

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
