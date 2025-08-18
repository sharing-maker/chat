"use client";

import { SessionType } from "@openim/wasm-client-sdk";
import MessageList from "../../components/message/MessageList";
import DeskConversationList from "../../components/conversation/DeskConversationList";
import { useConversationDetail } from "../../hooks/conversation/useConversation";
import AssignedSessionFilter from "../../components/session/AssignedSessionFilter";

const DChatDeskMessage = () => {
  const { conversationDetail } = useConversationDetail({
    sourceID: "3408237279",
    sessionType: SessionType.Group,
  });
  return (
    <div className="flex flex-1 flex-row h-screen bg-gray-50">
      <AssignedSessionFilter />
      <DeskConversationList />
      <MessageList
        conversationId="sg_3408237279"
        conversationData={conversationDetail}
      />
    </div>
  );
};

export default DChatDeskMessage;
