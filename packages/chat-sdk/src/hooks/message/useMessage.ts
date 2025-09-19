import { useEffect, useState } from "react";
import { ViewType, MessageItem, MessageType } from "@openim/wasm-client-sdk";
import { DChatSDK } from "../../constants/sdk";
import { useLatest, useRequest } from "ahooks";
import emitter, { emit } from "../../utils/events";
import isEmpty from "lodash/isEmpty";

const PAGE_SIZE = 50;

export const visibleTypeMessage = [
  MessageType.TextMessage,
  MessageType.PictureMessage,
  MessageType.VoiceMessage,
  MessageType.VideoMessage,
  MessageType.FileMessage,
  MessageType.AtTextMessage,
  MessageType.MergeMessage,
  MessageType.CardMessage,
  MessageType.LocationMessage,
  MessageType.CustomMessage,
  MessageType.QuoteMessage,
  MessageType.FaceMessage,
];

export const useMessage = (
  conversationId: string,
  searchClientMsgID?: string
) => {
  const [loadState, setLoadState] = useState({
    initLoading: true,
    hasMoreOld: true,
    hasMoreNew: false,
    messageList: [] as MessageItem[],
  });

  const latestLoadState = useLatest(loadState);

  const { loading: moreOldLoading, runAsync: getMoreOldMessages } = useRequest(
    async (loadMore = true) => {
      const reqConversationID = conversationId;
      const params = {
        count: PAGE_SIZE,
        startClientMsgID: loadMore
          ? latestLoadState.current?.messageList?.[
              latestLoadState.current?.messageList?.length - 1
            ]?.clientMsgID || ""
          : "",
        conversationID: conversationId ?? "",
        viewType: ViewType.History,
      };
      const { data } = await DChatSDK.getAdvancedHistoryMessageList(params);
      if (conversationId !== reqConversationID) return;
      setTimeout(() =>
        setLoadState((preState) => {
          let messageList = [
            ...(loadMore ? preState.messageList : []),
            ...data.messageList.toReversed(),
          ];
          messageList = removeDuplicateMessages(messageList);
          return {
            ...preState,
            initLoading: false,
            hasMoreOld: !data.isEnd,
            messageList,
          };
        })
      );
    },
    {
      manual: true,
    }
  );

  const { loading: moreNewLoading, runAsync: getMoreNewMessages } = useRequest(
    async (loadMore = true) => {
      const reqConversationID = conversationId;
      const { data } = await DChatSDK.getAdvancedHistoryMessageListReverse({
        count: PAGE_SIZE,
        startClientMsgID: loadMore
          ? latestLoadState.current?.messageList[0]?.clientMsgID || ""
          : "",
        conversationID: conversationId ?? "",
        viewType: ViewType.Search,
      });
      if (conversationId !== reqConversationID) return;
      setTimeout(() =>
        setLoadState((preState) => {
          let messageList = [
            ...data.messageList.toReversed(),
            ...(loadMore ? preState.messageList : []),
          ];
          messageList = removeDuplicateMessages(messageList);
          return {
            ...preState,
            initLoading: false,
            hasMoreNew: !data.isEnd,
            messageList,
          };
        })
      );
    },
    {
      manual: true,
    }
  );

  const { runAsync: searchMessages } = useRequest(
    async () => {
      if (!searchClientMsgID || !conversationId) return;
      const reqConversationID = conversationId;

      const { data: dataPrev } = await DChatSDK.getAdvancedHistoryMessageList({
        count: 10,
        startClientMsgID: searchClientMsgID,
        conversationID: conversationId ?? "",
        viewType: ViewType.History,
      });
      const { data: dataNext } =
        await DChatSDK.getAdvancedHistoryMessageListReverse({
          count: 10,
          startClientMsgID: searchClientMsgID,
          conversationID: conversationId ?? "",
          viewType: ViewType.Search,
        });

      const { data: dataCurrent } = await DChatSDK.findMessageList([
        {
          conversationID: conversationId ?? "",
          clientMsgIDList: [searchClientMsgID ?? ""],
        },
      ]);
      const currentMessages =
        dataCurrent?.findResultItems?.find(
          (item) => item.conversationID === conversationId
        )?.messageList || [];

      if (conversationId !== reqConversationID) return;
      setTimeout(() => {
        setLoadState((preState) => {
          let messageList = [
            ...dataNext.messageList.toReversed(),
            ...currentMessages,
            ...dataPrev.messageList.toReversed(),
          ];
          messageList = removeDuplicateMessages(messageList);
          return {
            ...preState,
            initLoading: false,
            hasMoreOld: !dataPrev.isEnd,
            hasMoreNew: !dataNext.isEnd,
            messageList,
          };
        });
      });
      setTimeout(() => {
        emit("CHAT_LIST_SCROLL_TO_MESSAGE", searchClientMsgID);
      }, 200);
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    const pushNewMessage = (message: MessageItem) => {
      if (
        latestLoadState.current?.messageList?.find(
          (item) => item.clientMsgID === message.clientMsgID
        )
      ) {
        return;
      }
      setLoadState((preState) => {
        const messageList = [message, ...preState.messageList];
        return {
          ...preState,
          messageList,
        };
      });
    };
    const updateOneMessage = (message: MessageItem) => {
      setLoadState((preState) => {
        const tmpList = [...preState.messageList];
        const idx = tmpList.findIndex(
          (msg) => msg.clientMsgID === message.clientMsgID
        );
        if (idx < 0) {
          return preState;
        }

        tmpList[idx] = { ...tmpList[idx], ...message };
        return {
          ...preState,
          messageList: tmpList,
        };
      });
    };
    emitter.on("PUSH_NEW_MSG", pushNewMessage);
    emitter.on("UPDATE_ONE_MSG", updateOneMessage);
    return () => {
      emitter.off("PUSH_NEW_MSG", pushNewMessage);
      emitter.off("UPDATE_ONE_MSG", updateOneMessage);
    };
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    if (!isEmpty(searchClientMsgID)) {
      searchMessages();
    } else {
      getMoreOldMessages(false);
    }
    return () => {
      setLoadState(() => ({
        initLoading: true,
        hasMoreOld: true,
        hasMoreNew: false,
        messageList: [] as MessageItem[],
      }));
    };
  }, [conversationId, searchClientMsgID]);

  return {
    loadState,
    latestLoadState,
    moreOldLoading,
    getMoreOldMessages,
    moreNewLoading,
    getMoreNewMessages,
  };
};

export const pushNewMessage = (message: MessageItem) =>
  emit("PUSH_NEW_MSG", message);
export const updateOneMessage = (message: MessageItem) =>
  emit("UPDATE_ONE_MSG", message);

export const getVisibleNeighbor = (
  allMessages: MessageItem[],
  current: MessageItem,
  direction: "prev" | "next"
): MessageItem | undefined => {
  const currentIndex = allMessages.findIndex(
    (m) => m.clientMsgID === current.clientMsgID
  );
  if (currentIndex === -1) return undefined;

  let index = direction === "prev" ? currentIndex + 1 : currentIndex - 1;

  while (index >= 0 && index < allMessages.length) {
    const candidate = allMessages[index];
    if (visibleTypeMessage.includes(candidate.contentType)) {
      return candidate;
    }
    index = direction === "prev" ? index - 1 : index + 1;
  }

  return undefined;
};

const removeDuplicateMessages = (messages: MessageItem[]) => {
  const seen = new Set<string>();
  return messages.filter((msg) => {
    if (seen.has(msg.clientMsgID)) {
      return false;
    }
    seen.add(msg.clientMsgID);
    return true;
  });
};
