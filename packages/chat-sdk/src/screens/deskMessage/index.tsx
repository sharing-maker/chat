"use client";

import MessageList from "../../components/message/MessageList";
import DeskConversationList from "../../components/conversation/DeskConversationList";
import AssignedSessionFilter from "../../components/session/AssignedSessionFilter";
import { useChatContext } from "../../context/ChatContext";
import { Spin } from "antd";
import { ConnectStatus } from "../../types/chat";
import useConversationStore from "../../store/conversation";

const DChatDeskMessage = () => {
  const selectedConversationId = useConversationStore(
    (state) => state.selectedConversationId
  );

  const { connectStatus } = useChatContext();
  return (
    <>
      {connectStatus === ConnectStatus.Connected ? (
        <div className="flex flex-1 flex-row h-screen bg-gray-50">
          <AssignedSessionFilter />
          <DeskConversationList />
          <MessageList conversationId={selectedConversationId} />
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
