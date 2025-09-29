import {
  FileMsgParamsByURL,
  ImageMsgParamsByURL,
  MessageType,
  Platform,
  SelfUserInfo,
  VideoMsgParamsByURL,
} from "@openim/wasm-client-sdk";
import { UploadFile } from "antd";

export enum DChatApplicationType {
  OBEFE = "OBEFE",
}

export enum ConnectStatus {
  Disconnected = 0,
  Connected = 1,
  Connecting = 2,
}

export enum SyncStatus {
  Loading = 0,
  Success = 1,
  Failed = 2,
}

export enum CustomType {
  CallingInvite = 200,
  CallingAccept = 201,
  CallingReject = 202,
  CallingCancel = 203,
  CallingHungup = 204,
}

export enum CustomMessageType {
  URL = 160,
}

export type DChatMessageType = CustomMessageType | MessageType;

export interface ChatContextType {
  user: SelfUserInfo | null;
  connectStatus: ConnectStatus;
  syncStatus: SyncStatus;
  getSelfUserInfo: () => void;
  updateConnectStatus: (status: ConnectStatus) => void;
  updateSyncStatus: (status: SyncStatus) => void;
}

export interface ChatProviderProps {
  children: React.ReactNode;
  config: DChatInitAndLoginConfig | null;
}

export interface ExtendMessageInfo {
  messageInfo?: {
    type: "MESSAGE_INFO";
    data: {
      type: "rich_text";
      content: string;
    };
  };
  sessionId: string;
  applicationType: DChatApplicationType;
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

export interface ExtendConversationInfo {
  applicationType?: "OBEFE";
  sessionInfo?: {
    type: "SESSION_INFO";
    data: {
      ownerId: string;
      botId: string;
    };
  };
}

export interface ExtendPublicUserInfo {
  userInfo?: {
    type: "USER_INFO";
    data: {
      username?: string;
    };
  };
}

export interface DChatInitAndLoginConfig {
  platformID: Platform;
  apiAddr: string;
  wsAddr: string;
  accessToken: string;
  userID: string;
  applicationType: DChatApplicationType;
}

export enum SessionStatus {
  UNASSIGNED = "UNASSIGNED",
  WAITING_PROCESS = "WAITING_PROCESS",
  IN_PROCESS = "IN_PROCESS",
  COMPLETED = "COMPLETED",
}

export enum SessionTag {
  NONE = "NONE",
  SLOW_PROCESSING = "SLOW_PROCESSING",
  AWAITING_REPLY = "AWAITING_REPLY",
  TEMPORARILY_PAUSED = "TEMPORARILY_PAUSED",
}

export enum BusinessNotificationType {
  SESSION_STATE_UPDATED = "SESSION_STATE_UPDATED",
}
