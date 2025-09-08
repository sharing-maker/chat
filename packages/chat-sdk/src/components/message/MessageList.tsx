"use client";
import { ConversationItem } from "@openim/wasm-client-sdk";
import { useMessage } from "../../hooks/message/useMessage";
import { Spin } from "antd";
import { useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import emitter from "../../utils/events";
import MessageItem from "./item";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageHeader from "./MessageHeader";
import MessageFooter from "./footer";

dayjs.extend(isToday);

interface MessageListProps {
  conversationId: string;
  className?: string;
  onClose?: () => void;
}

const MessageList = (props: MessageListProps) => {
  const { onClose, conversationId } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getMoreOldMessages, moreOldLoading, loadState, latestLoadState } =
    useMessage(conversationId);

  const lastMessage = useMemo(() => {
    const messageList = latestLoadState.current?.messageList;
    return messageList?.[messageList?.length - 1];
  }, [latestLoadState?.current?.messageList]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current?.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const loadMoreMessage = () => {
    if (!loadState.hasMoreOld || moreOldLoading) return;
    getMoreOldMessages();
  };

  useEffect(() => {
    emitter.on("CHAT_LIST_SCROLL_TO_BOTTOM", scrollToBottom);
    return () => {
      emitter.off("CHAT_LIST_SCROLL_TO_BOTTOM", scrollToBottom);
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 relative h-full bg-white">
      <MessageHeader onClose={onClose} />
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

      <MessageFooter lastMessage={lastMessage} />
    </div>
  );
};

export default MessageList;
