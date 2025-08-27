"use client";
import { ConversationItem, SessionType } from "@openim/wasm-client-sdk";
import { useMessage } from "../../hooks/message/useMessage";
import { Button, Input, Spin, Tooltip } from "antd";
import { Icon } from "../icon";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSendMessage } from "../../hooks/message/useSendMessage";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import emitter from "../../utils/events";
import MessageItem from "./MessageItem";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageHeader from "./MessageHeader";
import MessageFooter from "./footer";

dayjs.extend(isToday);

interface MessageListProps {
  conversationId: string;
  conversationData: ConversationItem | null;
  className?: string;
  onClose?: () => void;
}

const MessageList = (props: MessageListProps) => {
  const { conversationData, onClose, conversationId } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getMoreOldMessages, moreOldLoading, loadState, latestLoadState } =
    useMessage(conversationId);

  const { sendTextMessage } = useSendMessage({
    recvID:
      conversationData?.conversationType !== SessionType.Single
        ? ""
        : conversationData?.userID || "",
    groupID:
      conversationData?.conversationType === SessionType.Single
        ? ""
        : conversationData?.groupID || "",
  });
  const [textMessage, setTextMessage] = useState("");
  const [composing, setComposing] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current?.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const onSendTextMessage = useCallback(async () => {
    const messageList = latestLoadState.current?.messageList;
    setTextMessage("");
    const lastMessage = messageList?.[messageList?.length - 1];
    sendTextMessage(textMessage, lastMessage);
  }, [textMessage, sendTextMessage, latestLoadState]);

  const loadMoreMessage = () => {
    if (!loadState.hasMoreOld || moreOldLoading) return;

    getMoreOldMessages();
  };

  useEffect(() => {
    emitter.on("CHAT_LIST_SCROLL_TO_BOTTOM", scrollToBottom);
    console.log("CHAT_LIST_SCROLL_TO_BOTTOM");
    return () => {
      emitter.off("CHAT_LIST_SCROLL_TO_BOTTOM", scrollToBottom);
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 relative h-full bg-white">
      <MessageHeader conversationData={conversationData} onClose={onClose} />
      <div
        id="scrollableDiv"
        style={{
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <InfiniteScroll
          dataLength={loadState.groupMessageList?.length || 0}
          next={loadMoreMessage}
          style={{ display: "flex", flexDirection: "column-reverse" }}
          inverse={true}
          hasMore={loadState.hasMoreOld}
          loader={
            <div className="flex items-center justify-center py-2">
              <Spin />
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          {loadState.groupMessageList
            ?.toReversed()
            .map((message) => <MessageItem groupMessage={message} />)}
        </InfiniteScroll>
      </div>

      {/* <MessageFooter /> */}
      <div className="border-t px-4 py-3">
        <div className="border rounded-lg bg-gray-50">
          <div className="px-4 py-3 flex items-center gap-4">
            <Input
              placeholder="Nhập tin nhắn"
              size="small"
              variant="borderless"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyDown={(e) => {
                if (composing) {
                  return;
                }

                if (e.key === "Enter") {
                  onSendTextMessage();
                }
              }}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={() => setComposing(false)}
            />
            <Tooltip title="Gửi tin nhắn">
              <Button
                type="primary"
                shape="circle"
                size="middle"
                icon={<Icon icon="send-b" color="white" size={16} />}
                disabled={textMessage.length === 0}
                onClick={onSendTextMessage}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageList;
