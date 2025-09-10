"use client";

import { Spin } from "antd";
import { useGlobalEvent } from "../hooks/global/useGlobalEvent";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useChatContext } from "../context/ChatContext";
import { ConnectStatus, SyncStatus } from "../types/chat";
import { useSyncUsersInfo } from "../hooks/user/useUsersInfo";

dayjs.locale("vi");

interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout = ({ children }: MainLayoutProps) => {
  const { syncStatus, connectStatus } = useChatContext();
  useGlobalEvent();
  useSyncUsersInfo();

  return <>{children}</>;
};

export default MainLayout;
