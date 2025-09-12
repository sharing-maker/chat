"use client";

import {
  DChatBubble,
  DChatDeskMessage,
  useConversationStore,
} from "@droppii-org/chat-sdk";
import { useFetchSessionByStatus } from "@web/hook/chat/useFetchSessionsByStatus";
import { useFetchSessionSummary } from "@web/hook/chat/useFetchSessionSummary";
import { useEffect } from "react";

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

  useEffect(() => {
    if (listSessionQuery) {
      setAssignedSessionList(listSessionQuery);
    }
  }, [listSessionQuery, setAssignedSessionList]);

  return (
    <div className="h-full">
      <DChatDeskMessage />
      <DChatBubble conversationID="sg_bot_25620a9f-b251-4861-9c03-77dc3906dc69_cda72626-3946-49f9-88df-43930533e681" />
    </div>
  );
}
