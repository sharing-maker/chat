"use client";

import { useGlobalEvent } from "../hooks/global/useGlobalEvent";

interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout = ({ children }: MainLayoutProps) => {
  useGlobalEvent();
  return <div>{children}</div>;
};

export default MainLayout;
