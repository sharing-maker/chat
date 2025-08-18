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
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIxOTY3MDIzMTU1IiwiUGxhdGZvcm1JRCI6NSwiZXhwIjoxNzYzMjY3OTc5LCJpYXQiOjE3NTU0OTE5NzR9.-WStTlqROyTJnQ1Kgdp-5fXjW1Ihjls3Ir2vH_nMfIo",
    };
  }, []);

  return { chatConfigProps };
};
