import {
  ConversationItem,
  GroupItem,
  GroupMemberItem,
  SessionType,
} from "@openim/wasm-client-sdk";
import { create } from "zustand";
import { DChatSDK } from "../constants/sdk";
import { ConversationStore, IFilterSummary, ISessionSummary } from "./type";
import { conversationSort, isGroupSession } from "../utils/imCommon";
import useUserStore from "./user";
import { markConversationMessageAsRead } from "../hooks/conversation/useConversation";

const CONVERSATION_SPLIT_COUNT = 500;

const useConversationStore = create<ConversationStore>((set, get) => ({
  conversationData: null,
  setConversationData: (data) =>
    set({
      conversationData: data,
      selectedSourceId:
        data?.conversationType === SessionType.Group
          ? data?.groupID
          : data?.userID,
    }),
  selectedConversationId: "",
  setSelectedConversationId: (threadId) =>
    set({ selectedConversationId: threadId }),
  selectedSourceId: "",

  // assigned session
  summary: null,
  setSummary: (summary: ISessionSummary | null) => set({ summary }),
  filterSummary: {
    status: undefined,
    tag: undefined,
  },
  setFilterSummary: (filterSummary: IFilterSummary) => set({ filterSummary }),

  // conversation
  conversationList: [],
  currentConversation: undefined,
  unreadCount: 0,
  currentGroupInfo: undefined,
  currentMemberInGroup: undefined,
  getConversationListByReq: async (isOffset?: boolean) => {
    let tmpConversationList = [] as ConversationItem[];
    try {
      const { data } = await DChatSDK.getConversationListSplit({
        offset: isOffset ? get().conversationList.length : 0,
        count: CONVERSATION_SPLIT_COUNT,
      });

      tmpConversationList = data;
    } catch (error) {
      console.error("Error fetching conversation list:", error);
      return true;
    }

    set((state) => ({
      conversationList: [
        ...(isOffset ? state.conversationList : []),
        ...tmpConversationList,
      ],
    }));

    return tmpConversationList.length === CONVERSATION_SPLIT_COUNT;
  },
  updateConversationList: (list, type) => {
    const idx = list.findIndex(
      (c) => c.conversationID === get().currentConversation?.conversationID
    );

    if (idx > -1) {
      get().updateCurrentConversation(list[idx]);
      if (type === "filter" && list[idx].unreadCount > 0) {
        markConversationMessageAsRead(list[idx].conversationID);
      }
    }

    if (type === "filter") {
      set((state) => ({
        conversationList: conversationSort(
          [...list, ...state.conversationList],
          state.conversationList
        ),
      }));

      return;
    }

    let filterArr: ConversationItem[] = [];
    const chids = list.map((ch) => ch.conversationID);
    filterArr = get().conversationList.filter(
      (tc) => !chids.includes(tc.conversationID)
    );

    set(() => ({
      conversationList: conversationSort([...list, ...filterArr]),
    }));
  },

  updateCurrentConversation: async (conversation?: ConversationItem) => {
    if (!conversation) {
      set({ currentConversation: undefined });

      return;
    }

    const prevConversation = get().currentConversation;

    const toggleNewConversation =
      conversation.conversationID !== prevConversation?.conversationID;

    if (
      toggleNewConversation &&
      isGroupSession(conversation.conversationType)
    ) {
      get().getCurrentGroupInfoByReq(conversation.groupID);
      await get().getCurrentMemberInGroupByReq(conversation.groupID);
    }

    set(() => ({ currentConversation: { ...conversation } }));
  },

  getCurrentGroupInfoByReq: async (groupID: string) => {
    let groupInfo: GroupItem;

    try {
      const { data } = await DChatSDK.getSpecifiedGroupsInfo([groupID]);
      groupInfo = data[0];
    } catch (error) {
      console.error("Error fetching group info:", error);
      return;
    }

    set(() => ({ currentGroupInfo: { ...groupInfo } }));
  },

  getCurrentMemberInGroupByReq: async (groupID: string) => {
    let memberInfo: GroupMemberItem;
    const selfID = useUserStore.getState().selfInfo.id;
    try {
      const { data } = await DChatSDK.getSpecifiedGroupMembersInfo({
        groupID,
        userIDList: [selfID],
      });
      memberInfo = data[0];
    } catch (error) {
      set(() => ({ currentMemberInGroup: undefined }));
      console.error("Error fetching group members:", error);
      return;
    }

    set(() => ({
      currentMemberInGroup: memberInfo ? { ...memberInfo } : undefined,
    }));
  },
}));

export default useConversationStore;
