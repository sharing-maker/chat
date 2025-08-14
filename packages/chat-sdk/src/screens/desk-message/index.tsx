"use client";

import { SessionType } from "@openim/wasm-client-sdk";
import MessageList from "../../components/message/MessageList"
import DeskConversationList from "../../components/conversation/DeskConversationList"
import { useConversationDetail } from "src/hooks/conversation/useConversation"

const DChatDeskMessage = () => {
  const { conversationDetail } = useConversationDetail({
    sourceID: "3408237279",
    sessionType: SessionType.Group,
  });
  return (
    <div className="flex flex-row h-screen bg-gray-50">
      <DeskConversationList />
      <div className="flex-1 flex flex-col">
        <MessageList
          conversationId="sg_3408237279"
          conversationData={conversationDetail}
        />
      </div>
    </div>
  );
};

export default DChatDeskMessage;
