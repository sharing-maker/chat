import "./locales/i18n";

import DChatDeskMessage from "./screens/deskMessage";
import DChatBubble from "./screens/chatBubble";
import { Platform, LogLevel, SessionType } from "@openim/wasm-client-sdk";
import { Icon } from "./components/icon";
import useUserStore from "./store/user";
import { DChatInitAndLoginConfig, DChatApplicationType } from "./types/chat";
import useAuthStore from "./store/auth";

// Main exports for the SDK
export { ChatProvider, useChatContext } from "./context/ChatContext";

//Components
export { DChatDeskMessage, DChatBubble, Icon };

//Hooks
export { useDChatAuth } from "./hooks/user/useAuth";
export { useUpdateFcmToken } from "./hooks/user/useUpdateFcmToken";

//Store
export { useUserStore, DChatApplicationType, useAuthStore };

// export * from "./types/sdk";

export {
  Platform as DChatPlatform,
  LogLevel as DChatLogLevel,
  SessionType as DChatSessionType,
};

export type { DChatInitAndLoginConfig };
