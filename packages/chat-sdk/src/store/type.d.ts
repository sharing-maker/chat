import {
  GroupItem,
  GroupMemberItem,
  ConversationItem,
  PublicUserItem,
} from "@openim/wasm-client-sdk";
import { DChatPlatform } from "..";
import { DChatApplicationType } from "../types/chat";

export type ConversationListUpdateType = "push" | "filter";

type SessionStatus =
  (typeof SESSION_STATUS_ENUM)[keyof typeof SESSION_STATUS_ENUM];

type Tag = (typeof TAG_ENUM)[keyof typeof TAG_ENUM];

interface SessionStatusItem {
  type: SessionStatus;
  count: number;
}

interface TagItem {
  type: Tag;
  count: number;
}

interface ISessionSummary {
  activeSessionCount: number;
  completedSessionCount: number;
  sessionStatuses: SessionStatusItem[];
  tagCounts: TagItem[];
}

interface ISessionByStatus {
  id: string;
  botId: string;
  ownerId: string;
  conversationId: string;
  status: SessionStatus;
  tag: Tag;
  applicationType: DChatApplicationType;
  owner?: {
    id: string;
    avatar: string | null;
    fullName: string;
    username: string;
  };
}

interface IFilterSummary {
  status?: SessionStatus;
  tag?: Tag;
  searchTerm?: string;
}

interface ConversationStore {
  conversationData: ConversationItem | null;
  setConversationData: (
    data: ConversationItem,
    searchClientMsgID?: string
  ) => void;
  selectedConversationId: string;
  selectedSourceId: string;
  setSelectedConversationId: (threadId: string) => void;

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
  resetConversationStore: () => void;
  //search
  searchClientMsgID: string;
  setSearchClientMsgID: (clientMsgID: string) => void;
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

interface UsersInfoStore {
  usersInfo: Record<string, PublicUserItem>;
  upsertUsers: (data: PublicUserItem[]) => void;
}

interface AuthStore {
  accessToken: string;
  chatToken: string;
  apiAddress: string;
  wsAddress: string;
  platformID: DChatPlatform;
  userID: string;
  applicationType: DChatApplicationType;
  setAccessToken: (token: string) => void;
  setChatToken: (token: string) => void;
  initAuthStore: ({
    accessToken,
    chatToken,
    apiAddress,
    wsAddress,
    platformID,
    userID,
    applicationType,
  }: {
    accessToken?: string;
    chatToken?: string;
    apiAddress?: string;
    wsAddress?: string;
    platformID?: DChatPlatform;
    userID?: string;
    applicationType: DChatApplicationType | "";
  }) => void;
}
