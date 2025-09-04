import ChatBubble from "../../components/chatBubble/ChatBubble";
import { useChatContext } from "../../context/ChatContext";
import { ConnectStatus } from "../../types/chat";
import { useConversationList } from "../../hooks/conversation/useConversation";
import { useEffect } from "react";
import { SessionType } from "@openim/wasm-client-sdk";
import useConversationStore from "../../store/conversation";

interface DChatBubbleProps {
  conversationID: string;
  className?: string;
}

const DChatBubble = (props: DChatBubbleProps) => {
  const { conversationID, className } = props;

  const { connectStatus } = useChatContext();
  if (connectStatus !== ConnectStatus.Connected) return null;
  const { conversationList } = useConversationList();

  const setSelectedThreadId = useConversationStore(
    (state) => state.setSelectedThreadId
  );
  const setConversationData = useConversationStore(
    (state) => state.setConversationData
  );
  const setSelectedSourceId = useConversationStore(
    (state) => state.setSelectedSourceId
  );

  useEffect(() => {
    if (!conversationList) return;
    const conversation = conversationList.find(
      (item) => item.conversationID === conversationID
    );

    if (!conversation) return;
    const sourceId =
      conversation?.conversationType === SessionType.Group
        ? conversation?.groupID
        : conversation?.userID;
    setSelectedThreadId(conversation.conversationID);
    setConversationData(conversation);
    setSelectedSourceId(sourceId);
  }, [conversationList, conversationID]);

  return <ChatBubble className={className} />;
};

export default DChatBubble;
