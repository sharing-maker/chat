"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CbEvents, SelfUserInfo } from "@openim/wasm-client-sdk";
import {
  ChatContextType,
  ChatProviderProps,
  ConnectStatus,
} from "../types/chat";
import { DChatSDK } from "../constants/sdk";
import MainLayout from "../layout";

export const ChatContext = createContext<ChatContextType>({
  user: null,
  connectStatus: ConnectStatus.Disconnected,
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
  const [user, setUser] = useState<SelfUserInfo | null>(null);

  const getUserInfo = () => {
    DChatSDK.getSelfUserInfo()
      .then(({ data }) => {
        setUser(data);
      })
      .catch(({ errCode, errMsg }) => {
        console.log("getSelfUserInfo", errCode, errMsg);
      });
  };

  const handleLogin = (newToken?: string) => {
    DChatSDK.login({
      ...config,
      token: newToken || config.token,
    })
      .then((res) => {
        getUserInfo();
      })
      .catch(({ errCode, errMsg }) => {
        console.log("handleLogin", errCode, errMsg);
      });
  };

  useEffect(() => {
    handleLogin();
  }, [config]);

  useEffect(() => {
    DChatSDK.on(CbEvents.OnUserTokenExpired, () => {
      console.log("OnUserTokenExpired");
      refetchToken().then((token) => {
        if (!!token) {
          handleLogin(token);
        }
      });
    });
    DChatSDK.on(CbEvents.OnUserTokenInvalid, () => {
      console.log("OnUserTokenInvalid");
      refetchToken().then((token) => {
        if (!!token) {
          handleLogin(token);
        }
      });
    });
    DChatSDK.on(CbEvents.OnConnectSuccess, () => {
      setConnectStatus(ConnectStatus.Connected);
    });
    DChatSDK.on(CbEvents.OnConnecting, () => {
      setConnectStatus(ConnectStatus.Connecting);
    });
    DChatSDK.on(CbEvents.OnConnectFailed, () => {
      setConnectStatus(ConnectStatus.Disconnected);
    });
    return () => {
      DChatSDK.off(CbEvents.OnUserTokenExpired, () => {});
      DChatSDK.off(CbEvents.OnUserTokenInvalid, () => {});
      DChatSDK.off(CbEvents.OnConnectSuccess, () => {});
      DChatSDK.off(CbEvents.OnConnectFailed, () => {});
      DChatSDK.off(CbEvents.OnConnecting, () => {});
    };
  }, [refetchToken]);

  return (
    <ChatContext.Provider value={{ user, connectStatus }}>
      <MainLayout>{children}</MainLayout>
    </ChatContext.Provider>
  );
};
