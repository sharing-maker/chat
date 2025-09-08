import { useCallback, useEffect } from "react";
import useConversationStore from "../../store/conversation";
import { ConversationItem, SessionType } from "@openim/wasm-client-sdk";
import useUsersInfoStore from "../../store/usersInfo";
import { DChatSDK } from "../../constants/sdk";
import { ExtendConversationInfo } from "../../types/chat";

export const extractUserIdsFromConversations = (
  conversations: ConversationItem[]
) => {
  const ids: string[] = conversations.reduce((acc, c) => {
    if (c.conversationType === SessionType.Single) {
      acc.push(c.userID);
    } else if (c.conversationType === SessionType.Group) {
      const exConversationInfo = JSON.parse(
        c.ex || "{}"
      ) as ExtendConversationInfo;
      const sessionInfo = exConversationInfo?.sessionInfo;
      if (sessionInfo?.data?.ownerId) {
        acc.push(sessionInfo.data.ownerId);
      }
    }
    return acc;
  }, [] as string[]);

  return Array.from(new Set(ids));
};

export const useSyncUsersInfo = () => {
  const conversationList = useConversationStore(
    (state) => state.conversationList
  );

  const syncUsersInfo = useCallback(() => {
    const userIds = extractUserIdsFromConversations(conversationList);
    const { usersInfo, upsertUsers } = useUsersInfoStore.getState();
    const needFetch = userIds.filter((id) => !usersInfo[id]);

    if (needFetch.length > 0) {
      DChatSDK.getUsersInfo(needFetch)
        .then(({ data }) => {
          upsertUsers(data);
        })
        .catch((error) => {
          console.error("Error fetching users info:", error);
        });
    }
  }, [conversationList]);

  useEffect(() => {
    if (!conversationList) return;
    syncUsersInfo();
  }, [conversationList]);
};
