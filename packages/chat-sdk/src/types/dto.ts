import { MessageItem, MessageType } from "@openim/wasm-client-sdk";
import { SessionStatusItem, TagItem } from "../store/type";
import {
  BusinessNotificationType,
  DChatApplicationType,
  SessionStatus,
  SessionTag,
} from "./chat";

export interface BaseResponse<T> {
  statusCode: number;
  message: any;
  data: T;
  pageable?: Pageable;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface SearchMessageRequest {
  recvID?: string;
  searchTerm?: string;
  contentType: MessageType;
  page?: number;
  pageSize?: number;
  applicationType: DChatApplicationType;
}

export interface SearchMessageItem {
  chatLog: MessageItem;
  isRevoked: boolean;
}

export interface SearchMessageResponse {
  data: SearchMessageItem[];
  pageable: Pageable;
}

export interface ISessionSummaryResponse {
  activeSessionCount: number;
  completedSessionCount: number;
  sessionStatuses: SessionStatusItem[];
  tagCounts: TagItem[];
}

export interface SessionByTagOrStatusRequest {
  applicationType: DChatApplicationType;
  tag?: SessionTag;
  status?: SessionStatus;
  page: number;
  pageSize: number;
  searchTerm?: string;
  conversationIds?: string[];
}

export interface UpdateSessionResponse {
  id: string;
  botId: string;
  ownerId: string;
  supporterId?: string;
  conversationId: string;
  status: SessionStatus;
  startSeq: number;
  endSeq: number;
  tag: SessionTag;
  applicationType: DChatApplicationType;
}

export interface BusinessNotification<T> {
  data: T;
  key: BusinessNotificationType;
}
