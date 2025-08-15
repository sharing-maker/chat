import { useCallback, useEffect, useState } from "react";
import {
  getSDK,
  ViewType,
  AdvancedGetMessageResult,
  CbEvents,
  MessageItem,
} from "@openim/wasm-client-sdk";
const DChatSDK = getSDK();

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
  };
};
