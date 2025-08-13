"use client";

import { DChatDeskMessage } from "@droppii-org/chat-sdk";
import { useState } from "react";

export default function ChatPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set([0])
  );

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="flex h-screen relative">
      <DChatDeskMessage />
    </div>
  );
}
