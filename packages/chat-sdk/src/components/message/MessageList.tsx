"use client";
import { useMessage } from "../../hooks/message/useMessage";
import { Empty, Spin } from "antd";
import { useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import emitter from "../../utils/events";
import MessageItem from "./item";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageHeader from "./MessageHeader";
import MessageFooter from "./footer";
import { images } from "../../constants/images";
import { useTranslation } from "react-i18next";
import useConversationStore from "../../store/conversation";
import { isNumber } from "lodash";
import { useDebounceFn } from "ahooks";
import { MSG_ITEM_CONTENT_PREFIX, MSG_ITEM_PREFIX } from "../../constants";
import { markConversationMessageAsRead } from "../../hooks/conversation/useConversation";
import { useChatContext } from "../../context/ChatContext";

dayjs.extend(isToday);

interface MessageListProps {
  conversationId: string;
  searchClientMsgID?: string;
  className?: string;
  onClose?: () => void;
}

const BOTTOM_THRESHOLD = -5;
const MessageList = (props: MessageListProps) => {
  const { t } = useTranslation();
  const { user } = useChatContext();
  const { onClose, conversationId, searchClientMsgID } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    getMoreOldMessages,
    moreOldLoading,
    loadState,
    getMoreNewMessages,
    moreNewLoading,
    latestLoadState,
  } = useMessage(conversationId, searchClientMsgID);
  const conversationData = useConversationStore(
    (state) => state.conversationData
  );

  const handleMarkConversationMessageAsRead = () => {
    const lastMessage = latestLoadState?.current?.messageList?.[0];
    if (
      !latestLoadState?.current?.hasMoreNew &&
      !moreNewLoading &&
      lastMessage?.isRead === false &&
      lastMessage?.sendID !== user?.userID
    ) {
      markConversationMessageAsRead(conversationId);
    }
  };

  const scrollToBottom = () => {
    handleMarkConversationMessageAsRead();
    setTimeout(() => {
      if (
        isNumber(scrollRef.current?.scrollTop) &&
        scrollRef.current?.scrollTop >= BOTTOM_THRESHOLD
      ) {
        return;
      }
      scrollRef.current?.scrollTo({
        top: scrollRef.current?.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const scrollToMessage = (clientMsgID: string) => {
    setTimeout(() => {
      const targetElement = document.getElementById(
        `${MSG_ITEM_PREFIX}${clientMsgID}`
      );
      targetElement?.scrollIntoView({
        behavior: "auto",
        block: "center",
      });

      setTimeout(() => {
        const targetContentElement = document.getElementById(
          `${MSG_ITEM_CONTENT_PREFIX}${clientMsgID}`
        );
        targetContentElement?.classList.add(
          "zoom-in-out-element",
          "border-blue-500",
          "border"
        );

        // Khi animation kết thúc thì remove element
        const onEnd = () => {
          targetContentElement?.classList.remove(
            "zoom-in-out-element",
            "border-blue-500",
            "border"
          );
          targetContentElement?.removeEventListener("animationend", onEnd);
        };

        targetContentElement?.addEventListener("animationend", onEnd, {
          once: true,
        });
      }, 500);
    }, 200);
  };

  const loadMoreOldMessage = () => {
    if (!loadState.hasMoreOld || moreOldLoading) return;
    getMoreOldMessages();
  };

  const { run: loadMoreNewMessage } = useDebounceFn(
    () => {
      if (!loadState.hasMoreNew || moreNewLoading) return;
      getMoreNewMessages();
    },
    { wait: 200 }
  );

  useEffect(() => {
    emitter.on("CHAT_LIST_SCROLL_TO_BOTTOM", scrollToBottom);
    emitter.on("CHAT_LIST_SCROLL_TO_MESSAGE", scrollToMessage);
    return () => {
      emitter.off("CHAT_LIST_SCROLL_TO_BOTTOM", scrollToBottom);
      emitter.off("CHAT_LIST_SCROLL_TO_MESSAGE", scrollToMessage);
    };
  }, []);

  if (!conversationData) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Empty description={t("no_conversation_data")} />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col flex-1 relative h-full"
      style={{
        backgroundImage: `url(${images.conversationBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <MessageHeader onClose={onClose} />
      <div
        id="scrollableMessagesDiv"
        ref={scrollRef}
        style={{
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse",
          paddingBottom: 12,
        }}
      >
        <InfiniteScroll
          dataLength={loadState.messageList?.length || 0}
          next={loadMoreOldMessage}
          style={{ display: "flex", flexDirection: "column-reverse" }}
          inverse={true}
          hasMore={loadState.hasMoreOld}
          loader={
            <div className="flex items-center justify-center py-2">
              <Spin />
            </div>
          }
          scrollableTarget="scrollableMessagesDiv"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            if (target.scrollTop > BOTTOM_THRESHOLD) {
              handleMarkConversationMessageAsRead();
              loadMoreNewMessage();
            }
          }}
        >
          {loadState.messageList.map((message, _, array) => (
            <MessageItem
              key={message.clientMsgID}
              message={message}
              allMessages={array}
            />
          ))}
        </InfiniteScroll>
      </div>
      {moreNewLoading && (
        <div className="flex items-center justify-center py-2">
          <Spin />
        </div>
      )}
      <MessageFooter />
    </div>
  );
};

export default MessageList;
