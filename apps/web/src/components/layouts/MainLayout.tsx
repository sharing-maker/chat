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
import { useUserStore as UStore } from "@droppii-org/chat-sdk";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { chatConfigProps, onRefetchChatToken } = useChatSdkSetup();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { logout } = useDChatAuth();
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setAccessToken);
  const setChatToken = useUserStore((state) => state.setChatToken);
  const token = useUserStore((state) => state.accessToken);
  const { data: currentUser } = useFetchCurrentUser(!token);
  const getSelfInfo = UStore((state) => state.getSelfInfo);

  useEffect(() => {
    const token = window.localStorage.getItem("user_token") || "";
    const chatToken = window.localStorage.getItem("chat_token") || "";
    setToken(token);
    setChatToken(chatToken);
  }, []);

  useEffect(() => {
    if (token && currentUser?.data) {
      setUser(currentUser?.data);
      getSelfInfo(currentUser?.data);
    }
  }, [currentUser, setUser, token]);

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
