import { LogLevel, Platform } from "@openim/wasm-client-sdk";

export interface DChatConfigProps {
  platformID: Platform;
  apiAddr: string;
  wsAddr: string;
  userID: string;
  token: string;
  logLevel?: LogLevel;
  isLogStandardOutput?: boolean;
  tryParse?: boolean;
}
