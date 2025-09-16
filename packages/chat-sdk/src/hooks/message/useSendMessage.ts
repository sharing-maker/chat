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
import useAuthStore from "../../store/auth";

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
            const videoBaseInfo = await createVideoInfoWithThumbnail(file);
            const thumbFile = new File(
              [videoBaseInfo.thumbnail],
              file.name + "-thumb.jpg",
              {
                type: "image/jpeg",
              }
            );
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
              snapshotFile: thumbFile,
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
    applicationType: useAuthStore.getState().applicationType,
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

function createVideoInfoWithThumbnail(file: File): Promise<{
  duration: number;
  width: number;
  height: number;
  thumbnail: Blob; // thumbnail dạng blob
}> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration * 1000);
        const width = video.videoWidth;
        const height = video.videoHeight;

        // Seek tới giây 1 (nếu video dài hơn 1s) để lấy frame đẹp hơn
        video.currentTime = Math.min(1, video.duration / 2);
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas not supported");

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("Thumbnail capture failed");

            resolve({
              duration: Math.floor(video.duration * 1000),
              width: video.videoWidth,
              height: video.videoHeight,
              thumbnail: blob,
            });
          },
          "image/jpeg",
          0.85
        );
      };

      video.onerror = (err) => reject(err);
    } catch (e) {
      reject(e);
    }
  });
}
