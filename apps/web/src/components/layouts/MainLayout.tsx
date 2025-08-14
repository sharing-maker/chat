"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { MainLayoutSkeleton } from "../common/LoadingSkeleton";
import { ChatProvider } from "@droppii-org/chat-sdk";
import { useChatSdkSetup } from "@web/hook/chat";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { chatConfigProps } = useChatSdkSetup();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Add hydrated class to enable smooth transitions after mount
    document.documentElement.classList.add("hydrated");
  }, []);

  // Pages that should not show the sidebar
  const pagesWithoutSidebar = ["/login"];

  const shouldShowSidebar = !pagesWithoutSidebar.includes(pathname);

  if (!mounted) {
    // Return loading skeleton that matches the expected layout
    return <MainLayoutSkeleton showSidebar={shouldShowSidebar} />;
  }

  return (
    <ChatProvider config={chatConfigProps}>
      <div className="flex min-h-screen bg-white">
        {shouldShowSidebar && <Sidebar />}
        <div className="flex-1 bg-white">{children}</div>
      </div>
    </ChatProvider>
  );
}
