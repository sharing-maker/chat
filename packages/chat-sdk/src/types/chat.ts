import {
  InitAndLoginConfig,
  MessageItem,
  SelfUserInfo,
} from "@openim/wasm-client-sdk";

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
}
