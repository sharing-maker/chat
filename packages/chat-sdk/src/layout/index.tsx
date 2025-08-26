"use client";

import { useGlobalEvent } from "../hooks/global/useGlobalEvent";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout = ({ children }: MainLayoutProps) => {
  useGlobalEvent();
  return <div>{children}</div>;
};

export default MainLayout;
