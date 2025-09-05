"use client";

import { DChatDeskMessage, useConversationStore } from "@droppii-org/chat-sdk";
import { useFetchSessionByStatus } from "@web/hook/chat/useFetchSessionsByStatus";
import { useFetchSessionSummary } from "@web/hook/chat/useFetchSessionSummary";
import { useEffect } from "react";

export default function ChatPage() {
  const filterSummary = useConversationStore((state) => state.filterSummary);
  const setSummary = useConversationStore((state) => state.setSummary);

  const { data: summary } = useFetchSessionSummary();
  const { data: listSessionQuery } = useFetchSessionByStatus(filterSummary);

  useEffect(() => {
    if (summary) {
      setSummary(summary);
    }
  }, [summary, setSummary]);

  return (
    <div className="h-full">
      <DChatDeskMessage />
    </div>
  );
}
