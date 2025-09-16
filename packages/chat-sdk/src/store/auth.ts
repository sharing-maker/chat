import { create } from "zustand";
import { AuthStore } from "./type";
import { Platform } from "@openim/wasm-client-sdk";

const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: "",
  chatToken: "",
  apiAddress: "",
  wsAddress: "",
  platformID: Platform.Web,
  userID: "",
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
  }) => {
    set({
      accessToken,
      chatToken,
      apiAddress,
      wsAddress,
      platformID,
      userID,
      applicationType,
    });
  },
}));

export default useAuthStore;
