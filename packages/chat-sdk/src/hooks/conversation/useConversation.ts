import { ConversationItem, SessionType } from "@openim/wasm-client-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DChatSDK } from "../../constants/sdk";
import useUsersInfoStore from "../../store/usersInfo";
import { extractUserIdsFromConversations } from "../user/useUsersInfo";
import { ExtendConversationInfo, ExtendPublicUserInfo } from "../../types/chat";
import { useChatContext } from "../../context/ChatContext";

export const markConversationMessageAsRead = (conversationId: string) => {
  if (!conversationId) return;
  DChatSDK.markConversationMessageAsRead(conversationId)
    .then()
    .catch(({ errCode, errMsg }) => {
      console.error("markConversationMessageAsRead", errCode, errMsg);
    });
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
        console.error("getOneConversation", err);
      });
  }, [sourceID, sessionType]);

  useEffect(() => {
    getConversationDetail();
  }, [getConversationDetail]);

  return {
    conversationDetail,
  };
};

export const useConversationDisplayData = (
  conversation: ConversationItem | null
) => {
  const { user } = useChatContext();
  const usersInfo = useUsersInfoStore((state) => state.usersInfo);

  const userInfo = useMemo(() => {
    if (!conversation) return null;
    const userId = extractUserIdsFromConversations([conversation])?.[0];
    return usersInfo?.[userId];
  }, [conversation, usersInfo]);

  const conversationDisplayData = useMemo(() => {
    if (!conversation) return null;
    const exConversationInfo = JSON.parse(
      conversation.ex || "{}"
    ) as ExtendConversationInfo;
    const sessionInfo = exConversationInfo?.sessionInfo;
    const isSupportGroup =
      conversation.conversationType === SessionType.Group &&
      !!sessionInfo?.data;
    const isOwnerGroup =
      isSupportGroup && sessionInfo?.data?.ownerId === user?.userID;

    const exUserInfo = JSON.parse(userInfo?.ex || "{}") as ExtendPublicUserInfo;

    return {
      avatar:
        isSupportGroup && !isOwnerGroup
          ? userInfo?.faceURL
          : conversation?.faceURL,
      displayName:
        isSupportGroup && !isOwnerGroup
          ? `${userInfo?.nickname}${
              exUserInfo?.userInfo?.data?.username
                ? ` (${exUserInfo?.userInfo?.data?.username})`
                : ""
            }`
          : conversation?.showName || "",
    };
  }, [conversation, userInfo]);

  return {
    ...conversationDisplayData,
  };
};
