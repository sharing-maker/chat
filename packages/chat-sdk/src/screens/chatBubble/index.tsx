import { SessionType } from "@openim/wasm-client-sdk";
import ChatBubble from "../../components/chatBubble/ChatBubble";
import { useChatContext } from "../../context/ChatContext";

interface DChatBubbleProps {
  conversationId: string;
  sourceID: string;
  sessionType: SessionType;
  className?: string;
}

const DChatBubble = (props: DChatBubbleProps) => {
  const { conversationId, sourceID, sessionType, className } = props;
  const { isConnected } = useChatContext();
  if (!isConnected) return null;
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
