"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../common/Sidebar";
import { MainLayoutSkeleton } from "../common/LoadingSkeleton";
import { ChatProvider, useUpdateFcmToken } from "@droppii-org/chat-sdk";
import { useChatSdkSetup } from "@web/hook/chat/useChatSdk";
import { useDChatAuth, useAuthStore } from "@droppii-org/chat-sdk";
import useUserStore from "@web/hook/user/useUserStore";
import { useFetchCurrentUser } from "@web/hook/user/useFetchCurrentUser";
import { useUserStore as UStore } from "@droppii-org/chat-sdk";
import { getMessaging, onMessage } from "firebase/messaging";
import {
  getFcmToken,
  requestNotificationPermission,
} from "@web/core/notifications/NotificationUtils";
import useConversationStore from "../../../../../packages/chat-sdk/src/store/conversation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
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
  const chatToken = useAuthStore((state) => state.chatToken);

  const onGetFcmToken = useCallback(async () => {
    const fcmToken = await getFcmToken();

    if (fcmToken) {
      mutate(fcmToken);
    }
  }, [currentUser]);

  const handleOnMessage = useCallback(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging();
      onMessage(messaging, (payload) => {
        if (Notification.permission === "granted") {
          let ex: any = {};
          try {
            ex = JSON.parse(payload.data?.ex || "{}");
          } catch (error) {
            ex = {};
          }
          if (
            useConversationStore?.getState?.()?.selectedConversationId &&
            useConversationStore?.getState?.()?.selectedConversationId !==
              ex?.conversationId
          ) {
            const notification = new Notification(ex?.title || "Droppii Chat", {
              body: ex?.desc,
              icon: ex?.icon || "/droppii.jpeg",
              data: ex,
            });

            const audio = document.getElementById(
              "notiSound"
            ) as HTMLAudioElement | null;
            if (audio) {
              audio.currentTime = 0;
              audio.play();
            }

            notification.onclick = (e) => {
              notification.close();
              // Ví dụ: điều hướng trong tab đang mở
              if (ex?.conversationId) {
                router.push(`/chat?threadId=${ex.conversationId}`);
              }
              window?.focus();
            };
          }
        }
      });
    }
  }, [router]);

  useEffect(() => {
    const token = window.localStorage.getItem("user_token") || "";
    setToken(token);
  }, []);

  useEffect(() => {
    if (token && currentUser?.data) {
      requestNotificationPermission();
      setUser(currentUser?.data);
      getSelfInfo(currentUser?.data);
      handleOnMessage();
    }
  }, [currentUser, setUser, token]);

  useEffect(() => {
    if (chatToken) {
      onGetFcmToken();
    }
  }, [chatToken]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      // Bắt sự kiện từ SW gửi về
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "onNotificationNewMessageClick") {
          const { conversationId } = event.data;
          router.push(`/chat?threadId=${conversationId}`);
        }
      });
    }
  }, [router]);

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
        <audio
          id="notiSound"
          src="/sound/noti-sound.mp3"
          preload="auto"
          autoPlay={false}
          className="hidden"
        ></audio>
      </div>
    </ChatProvider>
  );
}
