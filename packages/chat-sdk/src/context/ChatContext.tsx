"use client";

import "../styles/global.css";
import { createContext, useContext, useEffect, useState } from "react";
import { SelfUserInfo } from "@openim/wasm-client-sdk";
import {
  ChatContextType,
  ChatProviderProps,
  ConnectStatus,
  SyncStatus,
} from "../types/chat";
import { DChatSDK } from "../constants/sdk";
import MainLayout from "../layout";
import useAuthStore from "../store/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";

const queryClient = new QueryClient();

export const ChatContext = createContext<ChatContextType>({
  user: null,
  connectStatus: ConnectStatus.Disconnected,
  syncStatus: SyncStatus.Success,
  getSelfUserInfo: () => {},
  updateConnectStatus: () => {},
  updateSyncStatus: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children, config }: ChatProviderProps) => {
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>(
    ConnectStatus.Disconnected
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.Success);
  const [user, setUser] = useState<SelfUserInfo | null>(null);
  const initAuthStore = useAuthStore((state) => state.initAuthStore);

  const getSelfUserInfo = () => {
    DChatSDK.getSelfUserInfo()
      .then(({ data }) => {
        setUser(data);
      })
      .catch(({ errCode, errMsg }) => {
        console.error("getSelfUserInfo", errCode, errMsg);
      });
  };

  const updateConnectStatus = (status: ConnectStatus) => {
    setConnectStatus(status);
  };

  const updateSyncStatus = (status: SyncStatus) => {
    setSyncStatus(status);
  };

  useEffect(() => {
    if (config) {
      initAuthStore({
        accessToken: config.accessToken,
        apiAddress: config.apiAddr,
        platformID: config.platformID,
        userID: config.userID,
        wsAddress: config.wsAddr,
        applicationType: config.applicationType,
      });
    }
  }, [config]);

  return (
    <ChatContext.Provider
      value={{
        user,
        connectStatus,
        syncStatus,
        getSelfUserInfo,
        updateConnectStatus,
        updateSyncStatus,
      }}
    >
      <ConfigProvider getPopupContainer={(triggerNode) => document.body}>
        <QueryClientProvider client={queryClient}>
          <MainLayout>{children}</MainLayout>
        </QueryClientProvider>
      </ConfigProvider>
    </ChatContext.Provider>
  );
};
