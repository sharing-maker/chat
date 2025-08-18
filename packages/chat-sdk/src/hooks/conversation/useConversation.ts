import {
  getSDK,
  ConversationItem,
  SessionType,
  CbEvents,
} from "@openim/wasm-client-sdk";
import { useCallback, useEffect, useState } from "react";
const DChatSDK = getSDK();

export const useConversationList = () => {
  const [conversationList, setConversationList] = useState<ConversationItem[]>(
    []
  );

  const getAllConversationList = useCallback(async () => {
    DChatSDK.getAllConversationList()
      .then(({ data }) => {
        setConversationList(data);
      })
      .catch((err) => {
        console.log("getAllConversationList", err);
      });
  }, []);

  const getOneConversation = useCallback(async () => {
    DChatSDK.getOneConversation({
      sourceID: "3408237279",
      sessionType: 3,
    })
      .then(({ data }) => {
        console.log("getOneConversation", data);
      })
      .catch((err) => {
        console.log("getOneConversation", err);
      });
  }, []);

  useEffect(() => {
    getAllConversationList();
    getOneConversation();
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
