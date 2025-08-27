import { useEffect, useState } from "react";
import { ViewType, MessageItem } from "@openim/wasm-client-sdk";
import { DChatSDK } from "../../constants/sdk";
import { ExtendMessageInfo, GroupMessageItem } from "../../types/chat";
import { v4 as uuidv4 } from "uuid";
import { useLatest, useRequest } from "ahooks";
import emitter, { emit } from "../../utils/events";

const PAGE_SIZE = 50;

export const useMessage = (conversationId: string) => {
  const [loadState, setLoadState] = useState({
    initLoading: true,
    hasMoreOld: true,
    messageList: [] as MessageItem[],
    groupMessageList: [] as GroupMessageItem[],
  });

  const latestLoadState = useLatest(loadState);

  const parseGroupMessageList = (messageList: MessageItem[]) => {
    if (!messageList) return [];
    const mGroupMessages: GroupMessageItem[] = messageList?.reduce(
      (acc: GroupMessageItem[], cur) => {
        const extendMessageInfo: ExtendMessageInfo = JSON.parse(
          cur?.ex || "{}"
        );
        if (extendMessageInfo?.groupMessageID) {
          const findGroupMessageIndex = acc.findIndex(
            (item) => item.groupMessageID === extendMessageInfo?.groupMessageID
          );
          if (findGroupMessageIndex === -1) {
            acc.push({
              groupMessageID: extendMessageInfo.groupMessageID,
              messages: [cur],
              sendID: cur.sendID,
              sendTime: cur.sendTime,
            });
          } else {
            acc[findGroupMessageIndex].messages.push(cur);
          }
        } else {
          acc.push({
            groupMessageID: uuidv4(),
            messages: [cur],
            sendID: cur.sendID,
            sendTime: cur.sendTime,
          });
        }
        return acc;
      },
      []
    );

    return mGroupMessages;
  };

  const { loading: moreOldLoading, runAsync: getMoreOldMessages } = useRequest(
    async (loadMore = true) => {
      const reqConversationID = conversationId;
      const { data } = await DChatSDK.getAdvancedHistoryMessageList({
        count: PAGE_SIZE,
        startClientMsgID: loadMore
          ? latestLoadState.current?.messageList[0]?.clientMsgID || ""
          : "",
        conversationID: conversationId ?? "",
        viewType: ViewType.History,
      });
      if (conversationId !== reqConversationID) return;
      setTimeout(() =>
        setLoadState((preState) => {
          const messageList = [
            ...data.messageList,
            ...(loadMore ? preState.messageList : []),
          ];
          const groupMessageList = parseGroupMessageList(messageList);
          return {
            ...preState,
            initLoading: false,
            hasMoreOld: !data.isEnd,
            messageList,
            groupMessageList,
          };
        })
      );
    },
    {
      manual: true,
    }
  );

  const loadHistoryMessages = () => getMoreOldMessages(false);

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
        const messageList = [...preState.messageList, message];
        const groupMessageList = parseGroupMessageList(messageList);
        return {
          ...preState,
          messageList,
          groupMessageList,
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
        const groupMessageList = parseGroupMessageList(tmpList);
        return {
          ...preState,
          messageList: tmpList,
          groupMessageList,
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
    loadHistoryMessages();
    return () => {
      setLoadState(() => ({
        initLoading: true,
        hasMoreOld: true,
        messageList: [] as MessageItem[],
        groupMessageList: [] as GroupMessageItem[],
      }));
    };
  }, [conversationId]);

  return {
    loadState,
    latestLoadState,
    moreOldLoading,
    getMoreOldMessages,
  };
};

export const pushNewMessage = (message: MessageItem) =>
  emit("PUSH_NEW_MSG", message);
export const updateOneMessage = (message: MessageItem) =>
  emit("UPDATE_ONE_MSG", message);
