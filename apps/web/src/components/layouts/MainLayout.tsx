"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { MainLayoutSkeleton } from "../common/LoadingSkeleton";
import { ChatProvider } from "@droppii-org/chat-sdk";
import { useChatSdkSetup } from "@web/hook/chat/useChatSdk";
import { useDChatAuth } from "@droppii-org/chat-sdk";
import useUserStore from "@web/hook/user/useUserStore";
import { useFetchCurrentUser } from "@web/hook/user/useFetchCurrentUser";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { chatConfigProps, onRefetchChatToken } = useChatSdkSetup();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const { logout } = useDChatAuth();
  const { data: currentUser } = useFetchCurrentUser(!hasToken);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const token = window.localStorage.getItem("user_token");
    setHasToken(!!token);
  }, []);

  useEffect(() => {
    if (hasToken) {
      setUser(currentUser);
    }
  }, [currentUser, setUser, hasToken]);

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
      <div className="flex bg-white">
        {shouldShowSidebar && <Sidebar onLogout={logout} />}
        <div className="flex-1 bg-white">{children}</div>
      </div>
    </ChatProvider>
  );
}
