import { MessageItem, MessageType, SessionType } from "@openim/wasm-client-sdk";
import { SessionStatus, SessionStatusItem, Tag, TagItem } from "../store/type";
import { DChatApplicationType } from "./chat";

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
  tag?: Tag;
  status?: SessionStatus;
  page: number;
  pageSize: number;
  searchTerm?: string;
}
