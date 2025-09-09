"use client";

import { DChatDeskMessage, useConversationStore } from "@droppii-org/chat-sdk";
import { useFetchSessionByStatus } from "@web/hook/chat/useFetchSessionsByStatus";
import { useFetchSessionSummary } from "@web/hook/chat/useFetchSessionSummary";
import { useEffect } from "react";
import { DChatSDK } from "../../../../../packages/chat-sdk/src/constants/sdk";

export default function ChatPage() {
  const filterSummary = useConversationStore((state) => state.filterSummary);
  const setSummary = useConversationStore((state) => state.setSummary);
  const setAssignedSessionList = useConversationStore(
    (state) => state.setAssignedSessionList
  );
  const updateConversationList = useConversationStore(
    (state) => state.updateConversationList
  );
  const conversationList = useConversationStore(
    (state) => state.conversationList
  );

  const { data: summary } = useFetchSessionSummary();
  const { data: listSessionQuery } = useFetchSessionByStatus({
    tag: filterSummary.tag,
    status: filterSummary.status,
  });

  useEffect(() => {
    if (summary) {
      setSummary(summary);
    }
  }, [summary, setSummary]);

  console.log(conversationList?.map((item) => item.conversationID));

  useEffect(() => {
    if (listSessionQuery) {
      setAssignedSessionList(listSessionQuery);
      const conversationIds = listSessionQuery.map(
        (session) => session.conversationId
      );
      console.log({ conversationIds });
      DChatSDK.getMultipleConversation(conversationIds).then(({ data }) => {
        console.log("nanana", data);
        updateConversationList(data, "filter");
      });
    }
  }, [listSessionQuery, setAssignedSessionList]);

  return (
    <div className="h-full">
      <DChatDeskMessage />
    </div>
  );
}
