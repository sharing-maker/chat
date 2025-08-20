import { SessionType } from "@openim/wasm-client-sdk";
import ChatBubble from "../../components/chatBubble/ChatBubble";
import { useChatContext } from "../../context/ChatContext";
import { ConnectStatus } from "../../types/chat";

interface DChatBubbleProps {
  conversationId: string;
  sourceID: string;
  sessionType: SessionType;
  className?: string;
}

const DChatBubble = (props: DChatBubbleProps) => {
  const { conversationId, sourceID, sessionType, className } = props;
  const { connectStatus } = useChatContext();
  if (connectStatus !== ConnectStatus.Connected) return null;
  return (
    <ChatBubble
      conversationId={conversationId}
      sourceID={sourceID}
      sessionType={sessionType}
      className={className}
    />
  );
};

export default DChatBubble;
