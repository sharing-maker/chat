import { MessageItem } from "@openim/wasm-client-sdk";
import mitt from "mitt";

type EmitterEvents = {
  CHAT_LIST_SCROLL_TO_BOTTOM: void;
  // message store
  PUSH_NEW_MSG: MessageItem;
  UPDATE_ONE_MSG: MessageItem;
};

const emitter = mitt<EmitterEvents>();

export const emit = emitter.emit;

export default emitter;
