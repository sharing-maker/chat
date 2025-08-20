import { useCallback, useEffect, useState } from "react";
import {
  ViewType,
  AdvancedGetMessageResult,
  CbEvents,
  MessageItem,
} from "@openim/wasm-client-sdk";
import { DChatSDK } from "../../constants/sdk";

export const useMessage = (conversationId?: string) => {
  const [dataMessages, setDataMessages] =
    useState<AdvancedGetMessageResult | null>(null);

  const getAdvancedHistoryMessageList = useCallback(() => {
    if (!conversationId) return;
    DChatSDK.getSelfUserInfo()
      .then(({ data }) => {
        console.log("getSelfUserInfo", data);
      })
      .catch(({ errCode, errMsg }) => {
        console.log("getSelfUserInfo", errCode, errMsg);
      });
    DChatSDK.getAdvancedHistoryMessageList({
      conversationID: conversationId,
      count: 1000,
      startClientMsgID: "",
      viewType: ViewType.History,
    })
      .then(({ data }) => {
        console.log("getAdvancedHistoryMessageList", data);
        setDataMessages(data);
      })
      .catch((err) => {
        console.log("getAdvancedHistoryMessageList", err);
      });
  }, [conversationId]);

  const onRecvNewMessages = useCallback(
    (data: MessageItem[]) => {
      getAdvancedHistoryMessageList();
    },
    [getAdvancedHistoryMessageList]
  );

  const markConversationMessageAsRead = useCallback(
    (message?: MessageItem) => {
      if (!conversationId) return;
      DChatSDK.markConversationMessageAsRead(conversationId)
        .then()
        .catch(({ errCode, errMsg }) => {
          // Failed call
        });
    },
    [conversationId]
  );

  useEffect(() => {
    getAdvancedHistoryMessageList();
  }, [getAdvancedHistoryMessageList]);

  useEffect(() => {
    DChatSDK.on(CbEvents.OnRecvNewMessages, ({ data }) => {
      console.log("OnRecvNewMessages123", data);
      onRecvNewMessages(data);
    });
    return () => {
      DChatSDK.off(CbEvents.OnRecvNewMessages, () => {});
    };
  }, [onRecvNewMessages]);

  return {
    ...dataMessages,
    refetch: getAdvancedHistoryMessageList,
    markConversationMessageAsRead,
  };
};
