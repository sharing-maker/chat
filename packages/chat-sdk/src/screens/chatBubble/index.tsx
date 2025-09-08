import ChatBubble from "../../components/chatBubble/ChatBubble";
import { useChatContext } from "../../context/ChatContext";
import { ConnectStatus } from "../../types/chat";
import { useEffect } from "react";
import useConversationStore from "../../store/conversation";

interface DChatBubbleProps {
  conversationID: string;
  className?: string;
}

const DChatBubble = (props: DChatBubbleProps) => {
  const { conversationID, className } = props;

  const { connectStatus } = useChatContext();
  if (connectStatus !== ConnectStatus.Connected) return null;
  const conversationList = useConversationStore(
    (state) => state.conversationList
  );

  const setSelectedConversationId = useConversationStore(
    (state) => state.setSelectedConversationId
  );
  const setConversationData = useConversationStore(
    (state) => state.setConversationData
  );

  useEffect(() => {
    if (!conversationList) return;
    const conversation = conversationList.find(
      (item) => item.conversationID === conversationID
    );

    if (!conversation) return;
    setSelectedConversationId(conversation.conversationID);
    setConversationData(conversation);
  }, [conversationList, conversationID]);

  return <ChatBubble className={className} />;
};

export default DChatBubble;
