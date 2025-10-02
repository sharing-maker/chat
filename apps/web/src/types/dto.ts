import { DChatPlatform } from "@droppii-org/chat-sdk";

export interface UpdateFcmTokenRequest {
  platformID: DChatPlatform;
  fcmToken: string;
  account: string;
  expireTime: number | null;
}
