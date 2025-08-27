"use client";

import { ConversationItem } from "@openim/wasm-client-sdk";
import { Avatar, Button } from "antd";
import { Icon } from "../icon";

interface MessageHeaderProps {
  conversationData: ConversationItem | null;
  onClose?: () => void;
}

const MessageHeader = ({ conversationData, onClose }: MessageHeaderProps) => {
  return (
    <div className="px-4 py-3 flex items-center border-b gap-3">
      <Avatar src={conversationData?.faceURL} size={"large"}>
        {conversationData?.showName?.charAt?.(0) || "A"}
      </Avatar>
      <div className="flex flex-col flex-1">
        <p>{conversationData?.showName || ""}</p>
        <p className="text-xs text-gray-500">{"2 thành viên"}</p>
      </div>
      <div className="flex items-center gap-1">
        <Button type="text" shape="default" className="text-gray-500 px-2">
          <Icon icon="search-o" size={24} />
        </Button>
        <Button type="text" shape="default" className="text-gray-500 px-2">
          <Icon icon="folder-o" size={24} />
        </Button>
        <Button type="text" shape="default" className="text-gray-500 px-2">
          <Icon icon="align-justify-o" size={24} />
        </Button>
        {!!onClose && (
          <Button
            type="text"
            shape="default"
            className="text-gray-500 px-2"
            onClick={onClose}
          >
            <Icon icon="close-b" size={24} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageHeader;
