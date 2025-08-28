import { create } from "zustand";

interface UserStore {
  user: any; //TODO: change to user type
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: any) => void;
  chatToken: string;
  setChatToken: (chatToken: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  accessToken: "",
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  chatToken: "",
  setChatToken: (chatToken) => {
    set({ chatToken });
  },
}));

export default useUserStore;
