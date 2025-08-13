"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pages that should not show the sidebar
  const pagesWithoutSidebar = ["/login"];

  const shouldShowSidebar = !pagesWithoutSidebar.includes(pathname);

  if (!mounted) {
    // Return a loading state that matches the expected layout
    return (
      <div className="flex min-h-screen">
        {shouldShowSidebar && (
          <div className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 z-40">
            {/* Loading skeleton for sidebar */}
            <div className="p-4 border-b border-gray-700">
              <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {shouldShowSidebar && <Sidebar />}
      <div>{children}</div>
    </div>
  );
}
