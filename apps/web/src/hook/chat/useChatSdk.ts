import { DChatInitAndLoginConfig, DChatPlatform } from "@droppii-org/chat-sdk";
import { useMemo, useRef } from "react";
import { useRefetchChatToken } from "./useChatToken";
import useUserStore from "../user/useUserStore";

export const useChatSdkSetup = () => {
  const { mutate: refetchChatToken } = useRefetchChatToken();
  const retryCount = useRef(0);
  const setChatToken = useUserStore((state) => state.setChatToken);
  const chatToken = useUserStore((state) => state.chatToken);
  const user = useUserStore((state) => state.user);

  const chatConfigProps: DChatInitAndLoginConfig | null = useMemo(() => {
    if (chatToken && user?.id) {
      return {
        platformID: DChatPlatform.Web,
        apiAddr: "https://apistg.droppii.com/chat-service",
        wsAddr: "wss://apistg.droppii.com/chat-service/ws",
        token: chatToken,
        userID: user?.id,
      };
    } else {
      return null;
    }
  }, [chatToken, user?.id]);

  const onRefetchChatToken = async (): Promise<string> => {
    let token = "";
    refetchChatToken(undefined, {
      onSuccess: (data) => {
        token = data?.data?.token;
        window.localStorage.setItem("chat_token", token);
        setChatToken(token);
      },
      onError: () => {
        retryCount.current++;
        if (retryCount.current < 3) {
          onRefetchChatToken();
        }
      },
    });
    return token;
  };

  return { chatConfigProps, onRefetchChatToken };
};
