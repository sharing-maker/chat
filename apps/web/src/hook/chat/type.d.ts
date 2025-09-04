type SessionStatus =
  | "UNASSIGNED"
  | "WAITING_PROCESS"
  | "IN_PROCESS"
  | "COMPLETED";

type Tag = "NONE" | "AWAITING_REPLY" | "SLOW_PROCESSING" | "TEMPORARILY_PAUSED";

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
  applicationType: string;
}
