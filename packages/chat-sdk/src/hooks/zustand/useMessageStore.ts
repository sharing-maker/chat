import { create } from "zustand";

interface MessageStore {
  selectedThreadId: string;
  setSelectedThreadId: (threadId: string) => void;
}

const useMessageStore = create<MessageStore>((set) => ({
  selectedThreadId: "",
  setSelectedThreadId: (threadId) => set({ selectedThreadId: threadId }),
}));

export default useMessageStore;
