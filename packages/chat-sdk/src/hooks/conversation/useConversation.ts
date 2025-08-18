import {
  ConversationItem,
  SessionType,
  CbEvents,
} from "@openim/wasm-client-sdk";
import { useCallback, useEffect, useState } from "react";
import { DChatSDK } from "../../constants/sdk";

export const useConversationList = () => {
  const [conversationList, setConversationList] = useState<ConversationItem[]>(
    []
  );

  const getAllConversationList = useCallback(async () => {
    DChatSDK.getAllConversationList()
      .then(({ data }) => {
        console.log("getAllConversationList", data);
        setConversationList(data);
      })
      .catch((err) => {
        console.log("getAllConversationList", err);
      });
  }, []);

  useEffect(() => {
    getAllConversationList();
  }, [getAllConversationList]);

  useEffect(() => {
    DChatSDK.on(CbEvents.OnConversationChanged, ({ data }) => {
      setConversationList(data);
    });
    return () => {
      DChatSDK.off(CbEvents.OnConversationChanged, () => {});
    };
  }, []);

  return {
    conversationList,
    getAllConversationList,
  };
};

export const useConversationDetail = ({
  sourceID,
  sessionType,
}: {
  sourceID: string;
  sessionType: SessionType;
}) => {
  const [conversationDetail, setConversationDetail] =
    useState<ConversationItem | null>(null);
  const getConversationDetail = useCallback(async () => {
    DChatSDK.getOneConversation({
      sourceID,
      sessionType,
    })
      .then(({ data }) => {
        console.log("getOneConversation", data);
        setConversationDetail(data);
      })
      .catch((err) => {
        console.log("getOneConversation", err);
      });
  }, [sourceID, sessionType]);

  useEffect(() => {
    getConversationDetail();
  }, [getConversationDetail]);

  return {
    conversationDetail,
  };
};
