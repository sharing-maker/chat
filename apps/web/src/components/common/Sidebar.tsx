"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@droppii-org/chat-sdk";
import { useCallback, useMemo, useState } from "react";
import {
  Menu,
  MenuProps,
  Layout,
  ConfigProvider,
  Button,
} from "@droppii-org/ui";
import clsx from "clsx";

type MenuItem = Required<MenuProps>["items"][number];

const { Sider } = Layout;

export default function Sidebar({
  onLogout,
}: {
  onLogout?: () => Promise<any>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = useCallback(async () => {
    window.localStorage.removeItem("user_token");
    window.localStorage.removeItem("chat_token");
    await onLogout?.();
    router.push("/login");
  }, [onLogout]);

  const { defaultSelectedKeys, defaultOpenKeys } = useMemo(() => {
    const path = pathname.split("/")[1];
    switch (path) {
      case "chat":
        return {
          defaultSelectedKeys: ["chat"],
          defaultOpenKeys: ["account_menu"],
        };
      case "account":
        return {
          defaultSelectedKeys: [],
          defaultOpenKeys: ["account_menu"],
        };
      default:
        return {
          defaultSelectedKeys: [],
          defaultOpenKeys: ["account_menu"],
        };
    }
  }, [pathname]);

  const menuItems = useMemo(() => {
    return [
      {
        label: "Tin nhắn",
        key: "chat",
        icon: <Icon icon="chat-dot-o" size={20} />,
        onClick: () => {
          router.push("/chat");
        },
      },
      {
        label: "Tài khoản",
        key: "account_menu",
        icon: <Icon icon="user-circle-b" size={20} />,
        type: "submenu",
        className: "crm-submenu",

        children: [
          {
            label: "Thông tin tài khoản",
            key: "account",
            onClick: () => {
              router.push("/account");
            },
          },
          {
            label: "Cài đặt thông báo",
            key: "notification",
            onClick: () => {},
          },
          {
            label: "Đăng xuất",
            key: "logout",
            onClick: () => {
              handleLogout();
            },
          },
        ],
      },
    ] as MenuItem[];
  }, [handleLogout]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            darkItemSelectedBg: "#fff",
            darkItemSelectedColor: "#2b7fff",
            darkSubMenuItemBg: "#2b7fff",
            darkPopupBg: "#2b7fff",
            darkItemColor: "#fff",
            darkItemHoverBg: "#51a2ff",
            darkItemBg: "#2b7fff",
          },
        },
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        width={220}
        className="bg-blue-500 h-full border-r border-gray-200 h-screen"
        trigger={null}
        theme="dark"
      >
        <div
          className={clsx(
            "flex items-center p-4 border-b justify-center border-b-gray-200 mb-2",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed && (
            <Image src="/droppii.svg" alt="Logo" width={80} height={32} />
          )}
          <Button
            type="text"
            shape="default"
            className="text-white w-8 h-8 p-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon
              icon={collapsed ? "angle-right-o" : "angle-left-o"}
              size={22}
            />
          </Button>
        </div>
        <Menu
          mode="inline"
          items={menuItems}
          inlineIndent={12}
          className="crm-sidebar-menu"
          theme="dark"
          defaultSelectedKeys={defaultSelectedKeys}
          defaultOpenKeys={defaultOpenKeys}
        />
      </Sider>
    </ConfigProvider>
  );
}
