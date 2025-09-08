"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CbEvents, SelfUserInfo } from "@openim/wasm-client-sdk";
import {
  ChatContextType,
  ChatProviderProps,
  ConnectStatus,
  SyncStatus,
} from "../types/chat";
import { DChatSDK } from "../constants/sdk";
import MainLayout from "../layout";

export const ChatContext = createContext<ChatContextType>({
  user: null,
  connectStatus: ConnectStatus.Disconnected,
  syncStatus: SyncStatus.Success,
  userTokenHandler: () => {},
  updateConnectStatus: () => {},
  updateSyncStatus: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({
  children,
  config,
  refetchToken,
}: ChatProviderProps) => {
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>(
    ConnectStatus.Disconnected
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.Success);
  const [user, setUser] = useState<SelfUserInfo | null>(null);

  const getUserInfo = () => {
    DChatSDK.getSelfUserInfo()
      .then(({ data }) => {
        setUser(data);
      })
      .catch(({ errCode, errMsg }) => {
        console.error("getSelfUserInfo", errCode, errMsg);
      });
  };

  const handleLogin = (newToken?: string) => {
    if (config) {
      DChatSDK.login({
        ...config,
        token: newToken || config.token,
      })
        .then((res) => {
          getUserInfo();
        })
        .catch(({ errCode, errMsg }) => {
          console.error("handleLogin", errCode, errMsg);
        });
    }
  };

  const userTokenHandler = () => {
    refetchToken().then((token) => {
      if (!!token) {
        handleLogin(token);
      }
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
      handleLogin();
    }
  }, [config]);

  return (
    <ChatContext.Provider
      value={{
        user,
        connectStatus,
        syncStatus,
        userTokenHandler,
        updateConnectStatus,
        updateSyncStatus,
      }}
    >
      <MainLayout>{children}</MainLayout>
    </ChatContext.Provider>
  );
};
