import { create } from "zustand";
import { IFilterSummary } from "./type";
import { SESSION_STATUS_ENUM } from "../constants";

interface SessionStore {
  filterSummary: IFilterSummary;
  setFilterSummary: (filterSummary: IFilterSummary) => void;
}

const useSessionStore = create<SessionStore>((set, get) => ({
  filterSummary: {
    status: SESSION_STATUS_ENUM.IN_PROCESS,
    tag: undefined,
  },
  setFilterSummary: (filterSummary: IFilterSummary) => set({ filterSummary }),
}));

export default useSessionStore;
