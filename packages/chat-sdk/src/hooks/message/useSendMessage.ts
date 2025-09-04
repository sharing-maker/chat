import {
  MergerMsgParams,
  MessageItem,
  MessageStatus,
  PicBaseInfo,
} from "@openim/wasm-client-sdk";
import { DChatSDK } from "../../constants/sdk";
import {
  ExtendMessageInfo,
  FileMsgParamsByFile,
  ImageMsgParamsByFile,
  VideoMsgParamsByFile,
} from "../../types/chat";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { useChatContext } from "../../context/ChatContext";
import { useCallback } from "react";
import { pushNewMessage, updateOneMessage } from "./useMessage";
import { emit } from "../../utils/events";
import { UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
import useConversationStore from "../../store/conversation";

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

export const createImageMessageByFile = async (file: ImageMsgParamsByFile) => {
  let imageMessage = await DChatSDK.createImageMessageByFile(
    file,
    new Date().getTime().toString()
  )
    .then(({ data }) => {
      return data;
    })
    .catch(({ errCode, errMsg }) => {
      console.error("createImageMessageByFile", errCode, errMsg);
      return null;
    });
  return imageMessage;
};

export const createMergerMessage = async (mergerMsgParams: MergerMsgParams) => {
  let mergerMessage = await DChatSDK.createMergerMessage(
    mergerMsgParams,
    new Date().getTime().toString()
  )
    .then(({ data }) => {
      return data;
    })
    .catch(({ errCode, errMsg }) => {
      console.error("createMergerMessage", errCode, errMsg);
      return null;
    });
  return mergerMessage;
};

export const createVideoMessageByFile = async (file: VideoMsgParamsByFile) => {
  let videoMessage = await DChatSDK.createVideoMessageByFile(
    file,
    new Date().getTime().toString()
  )
    .then(({ data }) => {
      return data;
    })
    .catch(({ errCode, errMsg }) => {
      console.error("createVideoMessageByFile", errCode, errMsg);
      return null;
    });
  return videoMessage;
};

export const createFileMessageByFile = async (file: FileMsgParamsByFile) => {
  let fileMessage = await DChatSDK.createFileMessageByFile(
    file,
    new Date().getTime().toString()
  )
    .then(({ data }) => {
      return data;
    })
    .catch(({ errCode, errMsg }) => {
      console.error("createFileMessageByFile", errCode, errMsg);
      return null;
    });
  return fileMessage;
};

export const useSendMessage = (lastMessage?: MessageItem) => {
  const { user } = useChatContext();
  const conversationData = useConversationStore(
    (state) => state.conversationData
  );
  const { userID: recvID, groupID } = conversationData || {};

  const sendMessage = useCallback(
    async (message: MessageItem) => {
      try {
        pushNewMessage(message);
        emit("CHAT_LIST_SCROLL_TO_BOTTOM");

        const { data: successMessage } = await DChatSDK.sendMessage({
          recvID: recvID || "",
          groupID: groupID || "",
          message,
        });
        updateOneMessage(successMessage);
      } catch (error) {
        updateOneMessage({
          ...message,
          status: MessageStatus.Failed,
        });
      }
    },
    [recvID, groupID]
  );

  const sendTextMessage = useCallback(
    async ({
      plainText,
      richText,
    }: {
      plainText: string;
      richText: string;
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

      sendMessage(messageItem);
    },
    [recvID, groupID, user, sendMessage, lastMessage]
  );

  const sendMergeMessage = useCallback(
    async ({
      richText,
      plainText,
      files,
    }: {
      richText: string;
      plainText: string;
      files: UploadFile[];
    }) => {
      if (!recvID && !groupID) return;
      const messageList: MessageItem[] = [];
      for (const fileWrapper of files) {
        const file = fileWrapper.originFileObj as RcFile;
        if (!file) continue;
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        const isDocument = file.type.startsWith("application/");
        try {
          if (isImage) {
            const picInfo = await createPicBaseInfoFromFile(file);
            const baseInfo = {
              uuid: uuidv4(),
              type: file.type,
              size: file.size,
              width: picInfo.width,
              height: picInfo.height,
              url: URL.createObjectURL(file),
            };
            const parsedImage: ImageMsgParamsByFile = {
              sourcePicture: baseInfo,
              bigPicture: baseInfo,
              snapshotPicture: baseInfo,
              sourcePath: "",
              file: file,
            };

            const imageMessage = await createImageMessageByFile(parsedImage);

            if (!imageMessage) continue;

            const extendMessageInfo = generateExtendMessageInfo({
              currentUserID: user?.userID || "",
              lastMessage:
                messageList.length > 0
                  ? messageList[messageList.length - 1]
                  : lastMessage,
            });

            messageList.push({
              ...imageMessage,
              ex: JSON.stringify(extendMessageInfo) || "{}",
            });
          } else if (isVideo) {
            const videoBaseInfo = await createVideoBaseInfoFromFile(file);
            const videoMessage = await createVideoMessageByFile({
              videoPath: "",
              duration: videoBaseInfo.duration,
              videoType: file.type,
              snapshotPath: "",
              videoUUID: uuidv4(),
              videoUrl: "",
              videoSize: file.size,
              snapshotUUID: "",
              snapshotSize: file.size,
              snapshotUrl: "",
              snapshotWidth: videoBaseInfo.width,
              snapshotHeight: videoBaseInfo.height,
              snapShotType: file.type,
              videoFile: file,
              snapshotFile: file,
            });
            if (!videoMessage) continue;

            const extendMessageInfo = generateExtendMessageInfo({
              currentUserID: user?.userID || "",
              lastMessage:
                messageList.length > 0
                  ? messageList[messageList.length - 1]
                  : lastMessage,
            });

            messageList.push({
              ...videoMessage,
              ex: JSON.stringify(extendMessageInfo) || "{}",
            });
          } else if (isDocument) {
            const fileMessage = await createFileMessageByFile({
              filePath: "",
              fileName: file.name,
              uuid: uuidv4(),
              sourceUrl: "",
              fileSize: file.size,
              fileType: file.type,
              file: file,
            });
            if (!fileMessage) continue;

            const extendMessageInfo = generateExtendMessageInfo({
              currentUserID: user?.userID || "",
              lastMessage:
                messageList.length > 0
                  ? messageList[messageList.length - 1]
                  : lastMessage,
            });

            messageList.push({
              ...fileMessage,
              ex: JSON.stringify(extendMessageInfo) || "{}",
            });
          }
        } catch (err) {
          console.error("Lỗi xử lý tin nhắn:", err);
        }
      }

      if (!!plainText && plainText.trim() !== "") {
        const extendMessageInfo = generateExtendMessageInfo({
          richText,
          currentUserID: user?.userID || "",
          lastMessage:
            messageList.length > 0
              ? messageList[messageList.length - 1]
              : lastMessage,
        });
        const textMessage = await createTextMessage(plainText);
        if (!textMessage) return;
        const messageItem = {
          ...textMessage,
          ex: JSON.stringify(extendMessageInfo) || "{}",
        };
        messageList.push(messageItem);
      }

      for (const message of messageList) {
        await sendMessage(message);
      }
    },
    [recvID, groupID, lastMessage, sendMessage]
  );

  return {
    sendTextMessage,
    sendMergeMessage,
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
    applicationType: "OBEFE", // TODO: Only support for cx chat - remove later
  } as ExtendMessageInfo;
};

const createPicBaseInfoFromFile = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = _URL.createObjectURL(file);
  });

function createVideoBaseInfoFromFile(file: File): Promise<{
  duration: number;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve({
          duration: Math.floor(video.duration * 1000), // ms
          width: video.videoWidth,
          height: video.videoHeight,
        });
      };

      video.onerror = (err) => {
        reject(err);
      };

      video.src = URL.createObjectURL(file);
    } catch (e) {
      reject(e);
    }
  });
}
