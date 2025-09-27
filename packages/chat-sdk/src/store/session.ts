import { create } from "zustand";
import { IFilterSummary } from "./type";
import { SessionStatus } from "../types/chat";

interface SessionStore {
  filterSummary: IFilterSummary;
  setFilterSummary: (filterSummary: IFilterSummary) => void;
}

const useSessionStore = create<SessionStore>((set, get) => ({
  filterSummary: {
    status: SessionStatus.IN_PROCESS,
    tag: undefined,
  },
  setFilterSummary: (filterSummary: IFilterSummary) => set({ filterSummary }),
}));

export default useSessionStore;
