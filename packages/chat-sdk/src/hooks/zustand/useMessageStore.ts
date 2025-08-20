import { create } from "zustand";

interface MessageStore {
  selectedThreadId: string;
  selectedSourceId: string;
  setSelectedThreadId: (threadId: string) => void;
  setSelectedSourceId: (sourceId: string) => void;
}

const useMessageStore = create<MessageStore>((set) => ({
  selectedThreadId: "",
  setSelectedThreadId: (threadId) => set({ selectedThreadId: threadId }),
  selectedSourceId: "",
  setSelectedSourceId: (sourceId) => set({ selectedSourceId: sourceId }),
}));

export default useMessageStore;
