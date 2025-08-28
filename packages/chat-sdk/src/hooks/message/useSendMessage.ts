import { MessageItem, MessageStatus } from "@openim/wasm-client-sdk";
import { DChatSDK } from "../../constants/sdk";
import { ExtendMessageInfo } from "../../types/chat";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { useChatContext } from "../../context/ChatContext";
import { useCallback } from "react";
import { pushNewMessage, updateOneMessage } from "./useMessage";
import { emit } from "../../utils/events";

interface SendMessageProps {
  recvID: string;
  groupID: string;
}

export const createTextMessage = async (text: string) => {
  let textMessage = await DChatSDK.createTextMessage(
    text,
    new Date().getTime().toString()
  )
    .then(({ data }) => {
      return data;
    })
    .catch(({ errCode, errMsg }) => {
      console.error("createTextMessage", errCode, errMsg);
      return null;
    });
  return textMessage;
};

export const useSendMessage = (props: SendMessageProps) => {
  const { recvID, groupID } = props;
  const { user } = useChatContext();

  const sendTextMessage = useCallback(
    async ({
      plainText,
      richText,
      lastMessage,
    }: {
      plainText: string;
      richText: string;
      lastMessage?: MessageItem;
    }) => {
      if (!recvID && !groupID) return;
      const textMessage = await createTextMessage(plainText);
      if (!textMessage) return;
      const extendMessageInfo = generateExtendMessageInfo({
        richText,
        currentUserID: user?.userID || "",
        lastMessage,
      });
      const messageItem = {
        ...textMessage,
        ex: JSON.stringify(extendMessageInfo) || "{}",
      };
      //manual send text msg = auto push
      pushNewMessage(messageItem);
      emit("CHAT_LIST_SCROLL_TO_BOTTOM");

      try {
        const { data: successMessage } = await DChatSDK.sendMessage({
          recvID,
          groupID,
          message: messageItem,
        });
        updateOneMessage(successMessage);
      } catch (error) {
        updateOneMessage({
          ...messageItem,
          status: MessageStatus.Failed,
        });
      }
    },
    [recvID, groupID, user]
  );

  return {
    sendTextMessage,
  };
};

export const generateExtendMessageInfo = ({
  richText,
  currentUserID,
  lastMessage,
}: {
  richText?: string;
  currentUserID: string;
  lastMessage?: MessageItem;
}) => {
  const diffSendTime = dayjs().diff(lastMessage?.sendTime, "minutes");
  const isSameSender = lastMessage?.sendID === currentUserID;
  const lastMessageExtendMessageInfo = JSON.parse(
    lastMessage?.ex || "{}"
  ) as ExtendMessageInfo;

  return {
    groupMessageID:
      isSameSender && diffSendTime <= 5
        ? lastMessageExtendMessageInfo?.groupMessageID || uuidv4()
        : uuidv4(),
    messageInfo: {
      type: "MESSAGE_INFO",
      data: {
        type: "rich_text",
        content: richText || "",
      },
    },
  } as ExtendMessageInfo;
};
