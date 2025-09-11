import { DChatInitAndLoginConfig, DChatPlatform } from "@droppii-org/chat-sdk";
import { useMemo } from "react";
import useUserStore from "../user/useUserStore";

export const useChatSdkSetup = () => {
  const accessToken = useUserStore((state) => state.accessToken);
  const user = useUserStore((state) => state.user);

  const chatConfigProps: DChatInitAndLoginConfig | null = useMemo(() => {
    if (accessToken && user?.id) {
      return {
        platformID: DChatPlatform.Web,
        apiAddr: "https://apistg.droppii.com",
        wsAddr: "wss://apistg.droppii.com",
        accessToken,
        userID: user?.id,
      };
    } else {
      return null;
    }
  }, [user?.id, accessToken]);

  return { chatConfigProps };
};
