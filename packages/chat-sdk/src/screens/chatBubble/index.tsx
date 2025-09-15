import ChatBubble from "../../components/chatBubble/ChatBubble";
import { useChatContext } from "../../context/ChatContext";
import { ConnectStatus, SyncStatus } from "../../types/chat";
import { useEffect } from "react";
import useConversationStore from "../../store/conversation";
import { Spin } from "antd";
import { DChatSDK } from "../../constants/sdk";

interface DChatBubbleProps {
  conversationID: string;
  className?: string;
}

const DChatBubble = (props: DChatBubbleProps) => {
  const { conversationID, className } = props;

  const { connectStatus, syncStatus } = useChatContext();
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
  const updateConversationList = useConversationStore(
    (state) => state.updateConversationList
  );

  useEffect(() => {
    const conversation = conversationList?.find(
      (item) => item.conversationID === conversationID
    );

    if (conversation) {
      setSelectedConversationId(conversation.conversationID);
      setConversationData(conversation);
    } else {
      DChatSDK.getMultipleConversation([conversationID]).then((res) => {
        if (res.data.length > 0) {
          setSelectedConversationId(conversationID);
          setConversationData(res.data[0]);
          updateConversationList(res.data, "filter");
        }
      });
    }
  }, [conversationList, conversationID]);

  return (
    <Spin spinning={syncStatus === SyncStatus.Loading}>
      <ChatBubble className={className} />
    </Spin>
  );
};

export default DChatBubble;
