import DChatDeskMessage from "./screens/desk-message"
import { Platform, LogLevel } from "@openim/wasm-client-sdk"
import { Icon } from "./components/icon"
import ChatBubble from "./components/ChatBubble"

// Main exports for the SDK
export { ChatProvider, useChatContext } from "./context/ChatContext"

//Screens
export { DChatDeskMessage }

export { Icon }
export { ChatBubble }

export * from "./types/sdk"

export { Platform as DChatPlatform, LogLevel as DChatLogLevel }
