import { ConversationItem } from "@openim/wasm-client-sdk";

export interface DChatConversationItem extends ConversationItem {
  lastMessage: string;
  timestamp: string;
}
