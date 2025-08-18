import DChatDeskMessage from "./screens/desk-message";
import {
  Platform,
  LogLevel,
  SessionType,
  InitAndLoginConfig,
} from "@openim/wasm-client-sdk";
import { Icon } from "./components/icon";
import ChatBubble from "./components/ChatBubble";

// Main exports for the SDK
export { ChatProvider, useChatContext } from "./context/ChatContext";

//Components
export { DChatDeskMessage, ChatBubble, Icon };

//Hooks
export { useDChatAuth } from "./hooks/user/useAuth";

// export * from "./types/sdk";

export {
  Platform as DChatPlatform,
  LogLevel as DChatLogLevel,
  SessionType as DChatSessionType,
};

export type { InitAndLoginConfig as DChatInitAndLoginConfig };
