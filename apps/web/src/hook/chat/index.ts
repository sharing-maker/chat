import { DChatInitAndLoginConfig, DChatPlatform } from "@droppii-org/chat-sdk";
import { useMemo } from "react";

export const useChatSdkSetup = () => {
  const chatConfigProps: DChatInitAndLoginConfig = useMemo(() => {
    return {
      platformID: DChatPlatform.Web,
      apiAddr: "https://apistg.droppii.com/chat-service",
      wsAddr: "wss://apistg.droppii.com/chat-service/ws",
      userID: "1967023155",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIxOTY3MDIzMTU1IiwiUGxhdGZvcm1JRCI6NSwiZXhwIjoxNzYzMzY2MTU1LCJpYXQiOjE3NTU1OTAxNTB9.RwwjTArIJaGHOuLvpOARCrCMflFJW4mkbmLFYXyE7JA",
    };
  }, []);

  return { chatConfigProps };
};
