"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
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
    // Return a loading state that matches the expected layout
    return (
      <div className="flex min-h-screen bg-white">
        {shouldShowSidebar && (
          <div className="w-64 bg-gray-900 text-white min-h-screen flex-shrink-0">
            {/* Loading skeleton for sidebar */}
            <div className="p-4 border-b border-gray-700">
              <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-700 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        )}
        <div className="flex-1 bg-white">
          {/* Loading content area */}
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ChatProvider config={chatConfigProps}>
      <div className="flex bg-white">
        {shouldShowSidebar && <Sidebar />}
        <div className="flex-1 bg-white">{children}</div>
      </div>
    </ChatProvider>
  );
}
