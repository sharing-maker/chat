"use client";

import { useGlobalEvent } from "../hooks/global/useGlobalEvent";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useSyncUsersInfo } from "../hooks/user/useUsersInfo";

dayjs.locale("vi");

interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout = ({ children }: MainLayoutProps) => {
  useGlobalEvent();
  useSyncUsersInfo();

  return <>{children}</>;
};

export default MainLayout;
