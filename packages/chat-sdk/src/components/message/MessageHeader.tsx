"use client";

import { ConversationItem } from "@openim/wasm-client-sdk";
import { Avatar, Button } from "antd";
import { Icon } from "../icon";
import { useConversationDisplayData } from "../../hooks/conversation/useConversation";
import useConversationStore from "../../store/conversation";
import MediaCollection from "../mediaCollection";

interface MessageHeaderProps {
  onClose?: () => void;
}

const MessageHeader = ({ onClose }: MessageHeaderProps) => {
  const conversationData = useConversationStore(
    (state) => state.conversationData
  );

  const { avatar, displayName } = useConversationDisplayData(conversationData);
  return (
    <div className="px-4 py-3 flex items-center border-b gap-3 bg-white">
      <Avatar src={avatar} size={"large"}>
        {displayName?.charAt?.(0) || "A"}
      </Avatar>
      <div className="flex flex-col flex-1">
        <p>{displayName || ""}</p>
        <p className="text-xs text-gray-500">{"2 thành viên"}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="text"
          shape="default"
          className="text-gray-500 w-8 h-8 p-0"
        >
          <Icon icon="search-o" size={22} />
        </Button>
        <MediaCollection />
        <Button
          type="text"
          shape="default"
          className="text-gray-500 w-8 h-8 p-0"
        >
          <Icon icon="align-justify-o" size={22} />
        </Button>
        {!!onClose && (
          <Button
            type="text"
            shape="default"
            className="text-gray-500 w-8 h-8 p-0"
            onClick={onClose}
          >
            <Icon icon="close-b" size={22} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageHeader;
