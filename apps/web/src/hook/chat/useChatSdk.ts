import { DChatInitAndLoginConfig, DChatPlatform } from "@droppii-org/chat-sdk";
import { useMemo, useRef } from "react";
import { useRefetchChatToken } from "./useChatToken";

export const useChatSdkSetup = () => {
  const { mutate: refetchChatToken } = useRefetchChatToken();
  const retryCount = useRef(0);

  const chatConfigProps: DChatInitAndLoginConfig = useMemo(() => {
    return {
      platformID: DChatPlatform.Web,
      apiAddr: "https://apistg.droppii.com/chat-service",
      wsAddr: "wss://apistg.droppii.com/chat-service/ws",
      userID: "1967023155",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIxOTY3MDIzMTU1IiwiUGxhdGZvcm1JRCI6NSwiZXhwIjoxNzYzNDU0Mzc2LCJpYXQiOjE3NTU2NzgzNzF9.MFvJVcqKZPN3_yw_g9MAVNG1TfRlc4LOjxqBCyCohN4",
    };
  }, []);

  const onRefetchChatToken = async (): Promise<string> => {
    let token = "";
    refetchChatToken(
      {
        platformID: DChatPlatform.Web,
        userID: "1967023155",
      },
      {
        onSuccess: (data) => {
          token = data.token;
        },
        onError: () => {
          retryCount.current++;
          if (retryCount.current < 3) {
            onRefetchChatToken();
          }
        },
      }
    );
    return token;
  };

  return { chatConfigProps, onRefetchChatToken };
};
