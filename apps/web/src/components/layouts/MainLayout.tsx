"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { MainLayoutSkeleton } from "../common/LoadingSkeleton";
import { ChatProvider } from "@droppii-org/chat-sdk";
import { useChatSdkSetup } from "@web/hook/chat/useChatSdk";
import { useDChatAuth } from "@droppii-org/chat-sdk";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { chatConfigProps, onRefetchChatToken } = useChatSdkSetup();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { logout } = useDChatAuth();

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("hydrated");
  }, []);

  const pagesWithoutSidebar = ["/login"];

  const shouldShowSidebar = !pagesWithoutSidebar.includes(pathname);

  if (!mounted) {
    return <MainLayoutSkeleton showSidebar={shouldShowSidebar} />;
  }

  return (
    <ChatProvider config={chatConfigProps} refetchToken={onRefetchChatToken}>
      <div className="flex min-h-screen bg-white">
        {shouldShowSidebar && <Sidebar onLogout={logout} />}
        <div className="flex-1 bg-white">{children}</div>
      </div>
    </ChatProvider>
  );
}
