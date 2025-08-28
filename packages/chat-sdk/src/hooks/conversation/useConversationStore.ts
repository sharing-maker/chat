import { create } from "zustand";

interface ConversationStore {
  conversationData: any;
  setConversationData: (data: any) => void;
  selectedThreadId: string;
  selectedSourceId: string;
  setSelectedThreadId: (threadId: string) => void;
  setSelectedSourceId: (sourceId: string) => void;
}

const useConversationStore = create<ConversationStore>((set) => ({
  conversationData: null,
  setConversationData: (data) => set({ conversationData: data }),
  selectedThreadId: "",
  setSelectedThreadId: (threadId) => set({ selectedThreadId: threadId }),
  selectedSourceId: "",
  setSelectedSourceId: (sourceId) => set({ selectedSourceId: sourceId }),
}));

export default useConversationStore;
