import { DChatConfigProps } from "./sdk"
import { SelfUserInfo } from "@openim/wasm-client-sdk"

export interface ChatContextType {
  user: SelfUserInfo | null
}

export interface ChatProviderProps {
  children: React.ReactNode;
  config: DChatConfigProps;
}
