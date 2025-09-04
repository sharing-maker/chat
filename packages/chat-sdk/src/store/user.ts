import { create } from "zustand";
import { IUserInfo, UserStore } from "./type";

const useUserStore = create<UserStore>((set, get) => ({
  selfInfo: {} as IUserInfo,
  getSelfInfo: (data: IUserInfo) => {
    set({ selfInfo: data });
  },
}));

export default useUserStore;
