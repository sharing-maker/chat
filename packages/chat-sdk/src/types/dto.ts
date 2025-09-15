import { MessageType, SessionType } from "@openim/wasm-client-sdk";
import { SessionStatus, SessionStatusItem, Tag, TagItem } from "../store/type";

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

export interface MediaCollectionRequest {
  recvID: string;
  contentType: MessageType;
  page: number;
  pageSize: number;
}

export interface MediaCollectionItem {
  chatLog: {
    sendID: string;
    recvID: string;
    msgFrom: string;
    contentType: MessageType;
    content: string;
    sendTime: number;
    createTime: number;
    sessionType: SessionType;
    isRead: boolean;
    isRevoked: boolean;
    clientMsgID: string;
    serverMsgID: string;
  };
  isRevoked: boolean;
}

export interface MediaCollectionResponse {
  data: MediaCollectionItem[];
  pageable: Pageable;
}

export interface ISessionSummaryResponse {
  activeSessionCount: number;
  completedSessionCount: number;
  sessionStatuses: SessionStatusItem[];
  tagCounts: TagItem[];
}

export interface SessionByTagOrStatusRequest {
  applicationType: "OBEFE";
  tag?: Tag;
  status?: SessionStatus;
  page: number;
  pageSize: number;
}
