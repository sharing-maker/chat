import {
  GroupItem,
  GroupMemberItem,
  ConversationItem,
} from "@openim/wasm-client-sdk";

export type ConversationListUpdateType = "push" | "filter";

interface ConversationStore {
  conversationData: ConversationItem | null;
  setConversationData: (data: ConversationItem) => void;
  selectedThreadId: string;
  selectedSourceId: string;
  setSelectedThreadId: (threadId: string) => void;
  setSelectedSourceId: (sourceId: string) => void;

  conversationList: ConversationItem[];
  currentConversation?: ConversationItem;
  unreadCount: number;
  currentGroupInfo?: GroupItem;
  currentMemberInGroup?: GroupMemberItem;
  getConversationListByReq: (isOffset?: boolean) => Promise<boolean>;
  updateConversationList: (
    list: ConversationItem[],
    type: ConversationListUpdateType
  ) => void;
  updateCurrentConversation: (conversation?: ConversationItem) => Promise<void>;
  getCurrentGroupInfoByReq: (groupID: string) => Promise<void>;
  getCurrentMemberInGroupByReq: (groupID: string) => Promise<void>;
}

interface IPersonalInfo {
  fullName: string;
  dateOfBirth: string;
  sex: number;
}

interface IUserInfo {
  id: string;
  personalInfo: IPersonalInfo;
  username: string;
  phone: string;
  email: string;
  avatarFullUrl: string;
}

interface UserStore {
  selfInfo: IUserInfo;
  getSelfInfo: (data: IUserInfo) => void;
}
