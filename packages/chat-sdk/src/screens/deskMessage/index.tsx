"use client";

import { SessionType } from "@openim/wasm-client-sdk";
import MessageList from "../../components/message/MessageList";
import DeskConversationList from "../../components/conversation/DeskConversationList";
import { useConversationDetail } from "../../hooks/conversation/useConversation";
import AssignedSessionFilter from "../../components/session/AssignedSessionFilter";
import { useChatContext } from "../../context/ChatContext";
import { Spin } from "antd";
import { ConnectStatus } from "../../types/chat";
import useConversationStore from "../../hooks/conversation/useConversationStore";

const DChatDeskMessage = () => {
  const selectedThreadId = useConversationStore(
    (state) => state.selectedThreadId
  );
  const selectedSourceId = useConversationStore(
    (state) => state.selectedSourceId
  );

  const { conversationDetail } = useConversationDetail({
    sourceID: selectedSourceId,
    sessionType: SessionType.Group,
  });

  const { connectStatus } = useChatContext();
  return (
    <>
      {connectStatus === ConnectStatus.Connected ? (
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
          {connectStatus === ConnectStatus.Connecting && <Spin fullscreen />}
        </div>
      )}
    </>
  );
};

export default DChatDeskMessage;
