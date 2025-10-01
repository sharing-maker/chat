"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Sidebar from "../common/Sidebar";
import { MainLayoutSkeleton } from "../common/LoadingSkeleton";
import { ChatProvider } from "@droppii-org/chat-sdk";
import { useChatSdkSetup } from "@web/hook/chat/useChatSdk";
import { useDChatAuth } from "@droppii-org/chat-sdk";
import useUserStore from "@web/hook/user/useUserStore";
import { useFetchCurrentUser } from "@web/hook/user/useFetchCurrentUser";
import { useUserStore as UStore } from "@droppii-org/chat-sdk";
import { getMessaging, getToken } from "firebase/messaging";

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

  const getFcmToken = async () => {
    console.log("getFcmToken");
    Notification.requestPermission().then((permission) => {
      console.log("Notification permission: ", permission);
      if (permission === "granted") {
        console.log("Notification permission granted");
        const messaging = getMessaging();
        getToken(messaging, {
          vapidKey:
            "BLqSEqd-hYfQIvzAvp8IlRpvp7f3BhXTz2YxgUJMPRCn75bKNaXNXldcwtNRDxGgIQHcNLRJaLRKEPfOKIV2Oy4",
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log("Current token: ", currentToken);
              // Send the token to your server and update the UI if necessary
              // ...
            } else {
              // Show permission request UI
              console.log(
                "No registration token available. Request permission to generate one."
              );
              // ...
            }
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
            // ...
          });
      }
    });
  };

  useEffect(() => {
    const token = window.localStorage.getItem("user_token") || "";
    setToken(token);
  }, []);

  useEffect(() => {
    if (token && currentUser?.data) {
      getFcmToken();
      setUser(currentUser?.data);
      getSelfInfo(currentUser?.data);
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
