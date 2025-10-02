"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../common/Sidebar";
import { MainLayoutSkeleton } from "../common/LoadingSkeleton";
import { ChatProvider, DChatPlatform } from "@droppii-org/chat-sdk";
import { useChatSdkSetup } from "@web/hook/chat/useChatSdk";
import { useDChatAuth } from "@droppii-org/chat-sdk";
import useUserStore from "@web/hook/user/useUserStore";
import { useFetchCurrentUser } from "@web/hook/user/useFetchCurrentUser";
import { useUserStore as UStore } from "@droppii-org/chat-sdk";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useUpdateFcmToken } from "@web/hook/user/useUpdateFcmToken";
import {
  getFcmToken,
  requestNotificationPermission,
} from "@web/core/notifications/NotificationUtils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { chatConfigProps } = useChatSdkSetup();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { logout } = useDChatAuth();
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setAccessToken);
  const token = useUserStore((state) => state.accessToken);
  const { data: currentUser } = useFetchCurrentUser(!token);
  const getSelfInfo = UStore((state) => state.getSelfInfo);
  const { mutate } = useUpdateFcmToken();

  const onGetFcmToken = useCallback(async () => {
    const fcmToken = await getFcmToken();
    console.log("fcmToken", fcmToken);
    if (fcmToken) {
      mutate({
        platformID: DChatPlatform.Web,
        fcmToken,
        account: currentUser?.data.id || "",
        expireTime: null,
      });
    }
  }, [currentUser]);

  const handleOnMessage = useCallback(() => {
    if ("serviceWorker" in navigator) {
      const messaging = getMessaging();
      onMessage(messaging, (payload) => {
        console.log("Message received in foreground: ", payload);

        // Ví dụ show notification bằng browser Notification API
        if (Notification.permission === "granted") {
          console.log("Notification permission granted");
          new Notification(payload?.notification?.title || "New message", {
            body: payload?.notification?.body,
            // icon: payload?.notification?.icon,
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem("user_token") || "";
    setToken(token);
  }, []);

  useEffect(() => {
    if (token && currentUser?.data) {
      requestNotificationPermission();
      onGetFcmToken();
      setUser(currentUser?.data);
      getSelfInfo(currentUser?.data);
      handleOnMessage();
    }
  }, [currentUser, setUser, token]);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("hydrated");
  }, []);

  const pagesWithoutSidebar = ["/login"];

  const shouldShowSidebar = useMemo(
    () => !pagesWithoutSidebar.includes(pathname),
    [pathname]
  );

  if (!mounted) {
    return <MainLayoutSkeleton showSidebar={shouldShowSidebar} />;
  }

  return (
    <ChatProvider config={chatConfigProps}>
      <div className="flex bg-white">
        {shouldShowSidebar && <Sidebar onLogout={logout} />}
        <div className="flex-1 bg-white">{children}</div>
      </div>
    </ChatProvider>
  );
}
