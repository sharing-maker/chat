import { create } from "zustand";
import { AuthStore } from "./type";
import { Platform } from "@openim/wasm-client-sdk";
import { DChatApplicationType } from "../types/chat";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: "",
  chatToken: "",
  apiAddress: "",
  wsAddress: "",
  platformID: Platform.Web,
  userID: "",
  applicationType: DChatApplicationType.OBEFE,
  isCx: false,
  isCrm: false,
  setAccessToken: (token: string) => set({ accessToken: token }),
  setChatToken: (token: string) => set({ chatToken: token }),
  initAuthStore: ({
    accessToken,
    chatToken,
    apiAddress,
    wsAddress,
    platformID,
    userID,
    applicationType,
    isCrm,
  }) => {
    const jwtParser = !!accessToken ? (jwtDecode(accessToken) as any) : null;
    const isCx = isCrm && jwtParser?.role?.includes("CRM_LIVE_CHAT");
    set({
      accessToken,
      chatToken,
      apiAddress,
      wsAddress,
      platformID,
      userID,
      applicationType,
      isCx,
      isCrm: !!isCrm,
    });
  },
}));

export default useAuthStore;
