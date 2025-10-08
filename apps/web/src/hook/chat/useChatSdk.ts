import {
  DChatApplicationType,
  DChatInitAndLoginConfig,
  DChatPlatform,
} from "@droppii-org/chat-sdk";
import { useMemo } from "react";
import useUserStore from "../user/useUserStore";

export const useChatSdkSetup = () => {
  const accessToken = useUserStore((state) => state.accessToken);
  const user = useUserStore((state) => state.user);

  const chatConfigProps: DChatInitAndLoginConfig | null = useMemo(() => {
    if (accessToken && user?.id) {
      return {
        platformID: DChatPlatform.Web,
        apiAddr: process.env.NEXT_PUBLIC_API_BASE_URL || "",
        wsAddr: process.env.NEXT_PUBLIC_API_BASE_URL || "",
        accessToken,
        userID: user?.id,
        applicationType: DChatApplicationType.OBEFE,
        isCrm: true,
      };
    } else {
      return null;
    }
  }, [user?.id, accessToken]);

  return { chatConfigProps };
};
