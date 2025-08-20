"use client";

import { SessionType } from "@openim/wasm-client-sdk";
import MessageList from "../../components/message/MessageList";
import DeskConversationList from "../../components/conversation/DeskConversationList";
import { useConversationDetail } from "../../hooks/conversation/useConversation";
import AssignedSessionFilter from "../../components/session/AssignedSessionFilter";
import useMessageStore from "../../hooks/zustand/useMessageStore";
import { useChatContext } from "../../context/ChatContext";
import { Spin } from "antd";

const DChatDeskMessage = () => {
  const { conversationDetail } = useConversationDetail({
    sourceID: "123-123",
    sessionType: SessionType.Group,
  });
  const selectedThreadId = useMessageStore((state) => state.selectedThreadId);

  const { isConnected } = useChatContext();
  return (
    <>
      {isConnected ? (
        <div className="flex flex-1 flex-row h-screen bg-gray-50">
          <AssignedSessionFilter />
          <DeskConversationList />
          <MessageList
            conversationId={selectedThreadId}
            conversationData={conversationDetail}
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-row h-screen bg-gray-50">
          <Spin fullscreen />
        </div>
      )}
    </>
  );
};

export default DChatDeskMessage;
