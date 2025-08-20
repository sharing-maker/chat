import { InitAndLoginConfig, SelfUserInfo } from "@openim/wasm-client-sdk";

export interface ChatContextType {
  user: SelfUserInfo | null;
  isConnected: boolean;
}

export interface ChatProviderProps {
  children: React.ReactNode;
  config: InitAndLoginConfig;
  refetchToken: () => Promise<string>;
}
