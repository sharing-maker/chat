"use client";

import { DChatDeskMessage, useConversationStore } from "@droppii-org/chat-sdk";
import { useFetchSessionSummary } from "@web/hook/chat/useFetchSessionSummary";
import { useEffect } from "react";

export default function ChatPage() {
  const { data: summary } = useFetchSessionSummary();
  const setSummary = useConversationStore((state) => state.setSummary);

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
