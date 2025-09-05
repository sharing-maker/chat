import {
  ConversationItem,
  SessionType,
  CbEvents,
} from "@openim/wasm-client-sdk";
import { useCallback, useEffect, useState } from "react";
import { DChatSDK } from "../../constants/sdk";

export const useConversationList = (selectedConversationId?: string) => {
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

  const markConversationMessageAsRead = useCallback(
    (conversationId: string) => {
      if (!conversationId) return;
      DChatSDK.markConversationMessageAsRead(conversationId)
        .then()
        .catch(({ errCode, errMsg }) => {
          // Failed call
        });
    },
    []
  );

  useEffect(() => {
    getAllConversationList();
  }, [getAllConversationList]);

  useEffect(() => {
    const handler = ({ data }: { data: ConversationItem[] }) => {
      setConversationList((prev) => {
        // Tạo map để cập nhật
        const map = new Map(prev.map((c) => [c.conversationID, c]));

        data.forEach((changed) => {
          map.set(changed.conversationID, changed);
        });

        return Array.from(map.values());
      });
    };

    DChatSDK.on(CbEvents.OnConversationChanged, handler);

    return () => {
      DChatSDK.off(CbEvents.OnConversationChanged, handler);
    };
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      markConversationMessageAsRead(selectedConversationId);
    }
  }, [selectedConversationId, markConversationMessageAsRead]);

  return {
    conversationList,
    getAllConversationList,
    markConversationMessageAsRead,
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
