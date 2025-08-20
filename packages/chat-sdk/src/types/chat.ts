import { InitAndLoginConfig, SelfUserInfo } from "@openim/wasm-client-sdk";

export enum ConnectStatus {
  Disconnected = 0,
  Connected = 1,
  Connecting = 2,
}
export interface ChatContextType {
  user: SelfUserInfo | null;
  connectStatus: ConnectStatus;
}

export interface ChatProviderProps {
  children: React.ReactNode;
  config: InitAndLoginConfig;
  refetchToken: () => Promise<string>;
}
