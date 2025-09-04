import {
  ConversationItem,
  GroupItem,
  GroupMemberItem,
} from "@openim/wasm-client-sdk";
import { create } from "zustand";
import { DChatSDK } from "../constants/sdk";
import { ConversationStore } from "./type";
import { conversationSort, isGroupSession } from "../utils/imCommon";
import useUserStore from "./user";

const CONVERSATION_SPLIT_COUNT = 500;

const useConversationStore = create<ConversationStore>((set, get) => ({
  conversationData: null,
  setConversationData: (data) => set({ conversationData: data }),
  selectedThreadId: "",
  setSelectedThreadId: (threadId) => set({ selectedThreadId: threadId }),
  selectedSourceId: "",
  setSelectedSourceId: (sourceId) => set({ selectedSourceId: sourceId }),

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

    if (idx > -1) get().updateCurrentConversation(list[idx]);

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
