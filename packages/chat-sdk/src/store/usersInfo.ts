import { create } from "zustand";
import { UsersInfoStore } from "./type";

const useUsersInfoStore = create<UsersInfoStore>((set, get) => ({
  usersInfo: {},
  upsertUsers: (list) =>
    set((state) => {
      const next = { ...state.usersInfo };
      list.forEach((u) => {
        next[u.userID] = { ...next[u.userID], ...u };
      });
      return { usersInfo: next };
    }),
}));

export default useUsersInfoStore;
