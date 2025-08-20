"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CbEvents, SelfUserInfo } from "@openim/wasm-client-sdk";
import { ChatContextType, ChatProviderProps } from "../types/chat";
import { Spin } from "antd";
import { DChatSDK } from "../constants/sdk";

export const ChatContext = createContext<ChatContextType>({
  user: null,
  isConnected: false,
});

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({
  children,
  config,
  refetchToken,
}: ChatProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
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
      setIsConnected(true);
    });
    DChatSDK.on(CbEvents.OnConnectFailed, () => {
      setIsConnected(false);
    });
    return () => {
      DChatSDK.off(CbEvents.OnUserTokenExpired, () => {});
      DChatSDK.off(CbEvents.OnUserTokenInvalid, () => {});
      DChatSDK.off(CbEvents.OnConnectSuccess, () => {});
      DChatSDK.off(CbEvents.OnConnectFailed, () => {});
    };
  }, [refetchToken]);

  console.log("isConnected", isConnected);
  return (
    <ChatContext.Provider value={{ user, isConnected }}>
      {children}
    </ChatContext.Provider>
  );
};
