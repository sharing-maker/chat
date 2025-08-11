import { DChatConfigProps, DChatPlatform } from "@droppii-org/chat-sdk";
import { useMemo } from "react";

export const useChatSdkSetup = () => {

  const chatConfigProps: DChatConfigProps = useMemo(() => {
    return {
      platformID: DChatPlatform.Web,
      apiAddr: "https://apistg.droppii.com/chat-service",
      wsAddr: "wss://apistg.droppii.com/chat-service/ws",
      userID: "3526966997",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIzNTI2OTY2OTk3IiwiUGxhdGZvcm1JRCI6NSwiZXhwIjoxNzYyMzk2NDY4LCJpYXQiOjE3NTQ2MjA0NjN9.WhNDCiIawE-OEEb-2RaTmocvXjLSjY-d48lJdzMSYnQ",
    };
  }, []);

  return { chatConfigProps };
};