"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { InitAndLoginConfig, SelfUserInfo } from "@openim/wasm-client-sdk";
import { ChatContextType, ChatProviderProps } from "../types/chat";
import { Spin } from "antd";
import { DChatSDK } from "../constants/sdk";

export const ChatContext = createContext<ChatContextType>({
  user: null,
});

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children, config }: ChatProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SelfUserInfo | null>(null);

  const getUserInfo = () => {
    DChatSDK.getSelfUserInfo()
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch(({ errCode, errMsg }) => {
        console.log("getSelfUserInfo", errCode, errMsg);
      });
  };

  const handleLogin = () => {
    DChatSDK.login(config as InitAndLoginConfig)
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

  return (
    <ChatContext.Provider value={{ user }}>
      {loading ? <Spin fullscreen /> : children}
    </ChatContext.Provider>
  );
};
