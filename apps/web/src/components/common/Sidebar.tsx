"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@droppii-org/chat-sdk";
import { useState, useEffect } from "react";
import { SidebarSkeleton } from "./LoadingSkeleton";

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Chat",
    href: "/chat",
    icon: "chat-square-b",
  },
  {
    label: "Tài khoản",
    href: "/account",
    icon: "user-b",
  },
];

export default function Sidebar({ onLogout }: { onLogout?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    // Có thể thêm logic xóa token/session ở đây
    // localStorage.removeItem('authToken');
    await onLogout?.();
    router.push("/login");
  };

  if (pathname === "/login") {
    return null;
  }

  if (!mounted) {
    return <SidebarSkeleton />;
  }

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-gray-900 text-white min-h-screen transition-all duration-300 ease-in-out flex flex-col`}
    >
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Image src="/droppii.svg" alt="Logo" width={32} height={32} />
            <h1 className="text-lg font-bold">Droppii Chat</h1>
          </div>
        )}
        {isCollapsed && (
          <Image src="/droppii.svg" alt="Logo" width={24} height={24} />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-gray-800 transition-colors ml-auto"
        >
          <Icon icon="menu" size={16} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href as any}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <div className="flex-shrink-0">
                    <Icon icon={item.icon} size={20} />
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-400 truncate">
                admin@droppii.com
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-300 hover:bg-red-600 hover:text-white group ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Icon icon="logout-o" size={20} className="flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Đăng xuất</span>
          )}
        </button>
      </div>
    </div>
  );
}
