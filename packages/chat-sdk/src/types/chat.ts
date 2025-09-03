import {
  FileMsgParamsByURL,
  ImageMsgParamsByURL,
  InitAndLoginConfig,
  MessageItem,
  SelfUserInfo,
  VideoMsgParamsByURL,
} from "@openim/wasm-client-sdk";
import { UploadFile } from "antd";

export enum ConnectStatus {
  Disconnected = 0,
  Connected = 1,
  Connecting = 2,
}

export enum CustomType {
  CallingInvite = 200,
  CallingAccept = 201,
  CallingReject = 202,
  CallingCancel = 203,
  CallingHungup = 204,
}

export interface ChatContextType {
  user: SelfUserInfo | null;
  connectStatus: ConnectStatus;
}

export interface ChatProviderProps {
  children: React.ReactNode;
  config: InitAndLoginConfig | null;
  refetchToken: () => Promise<string>;
}

export interface GroupMessageItem
  extends Pick<MessageItem, "sendID" | "sendTime"> {
  groupMessageID: string;
  messages: MessageItem[];
}

export interface ExtendMessageInfo {
  groupMessageID: string;
  messageInfo?: {
    type: "MESSAGE_INFO";
    data: {
      type: "rich_text";
      content: string;
    };
  };
  sessionInfo?: {
    type: "SESSION_INFO";
    data: {
      sessionId: string;
      applicationType: "OBEFE";
    };
  };
  applicationType?: "OBEFE";
}

export interface MessageFooterContextType {
  onSendMessage: ({
    plainText,
    richText,
    type,
  }: {
    plainText: string;
    richText: string;
    type: "text" | "file";
  }) => void;
  listUploadFiles: UploadFile[];
  setListUploadFiles: (files: UploadFile[]) => void;
}

export interface ImageMsgParamsByFile extends ImageMsgParamsByURL {
  file: File;
}

export interface VideoMsgParamsByFile extends VideoMsgParamsByURL {
  videoFile: File;
  snapshotFile: File;
}

export interface FileMsgParamsByFile extends FileMsgParamsByURL {
  file: File;
}
