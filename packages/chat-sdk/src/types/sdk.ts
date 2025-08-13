export enum DChatPlatform {
  iOS = 1,
  Android,
  Windows,
  OSX,
  Web,
  MiniProgram,
  Linux,
}

export enum DChatLogLevel {
  Panic = 0,
  Fatal,
  Error,
  Warn,
  Info,
  Debug,
}

export enum SessionType {
  Single = 1,
  Group = 3,
  Notification = 4,
}

export interface DChatConfigProps {
  platformID: DChatPlatform;
  apiAddr: string;
  wsAddr: string;
  userID: string;
  token: string;
  logLevel?: DChatLogLevel;
  isLogStandardOutput?: boolean;
  tryParse?: boolean;
}
