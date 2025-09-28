import { MessageItem } from "@openim/wasm-client-sdk";
import mitt from "mitt";
import { UpdateSessionResponse } from "../types/dto";

type EmitterEvents = {
  CHAT_LIST_SCROLL_TO_BOTTOM: void;
  CHAT_LIST_SCROLL_TO_MESSAGE: string;
  // message store
  PUSH_NEW_MSG: MessageItem;
  UPDATE_ONE_MSG: MessageItem;
  //session
  UPDATE_SESSION: UpdateSessionResponse;
};

const emitter = mitt<EmitterEvents>();

export const emit = emitter.emit;

export default emitter;
