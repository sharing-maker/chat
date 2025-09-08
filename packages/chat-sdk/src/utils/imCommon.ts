import { ConversationItem, SessionType } from "@openim/wasm-client-sdk";
import { GroupSessionTypes } from "../constants/im";
import useConversationStore from "../store/conversation";

export const isGroupSession = (sessionType?: SessionType) =>
  sessionType ? GroupSessionTypes.includes(sessionType) : false;

export const initStore = () => {
  const { getConversationListByReq } = useConversationStore.getState();

  getConversationListByReq();
};

export const conversationSort = (
  conversationList: ConversationItem[],
  originalList?: ConversationItem[]
) => {
  const listWithIndex = conversationList.map((item, index) => ({
    ...item,
    originalIndex:
      originalList?.findIndex(
        (c) => c.conversationID === item.conversationID
      ) ?? index,
  }));

  const arr: string[] = [];
  const filterArr = listWithIndex.filter((c) => {
    if (!arr.includes(c.conversationID)) {
      arr.push(c.conversationID);
      return true;
    }
    return false;
  });

  filterArr.sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      const aCompare =
        a.draftTextTime > a.latestMsgSendTime
          ? a.draftTextTime
          : a.latestMsgSendTime;
      const bCompare =
        b.draftTextTime > b.latestMsgSendTime
          ? b.draftTextTime
          : b.latestMsgSendTime;

      if (aCompare > bCompare) {
        return -1;
      } else if (aCompare < bCompare) {
        return 1;
      } else {
        if (!originalList) return 0;
        return a.originalIndex - b.originalIndex;
      }
    } else if (a.isPinned && !b.isPinned) {
      return -1;
    } else {
      return 1;
    }
  });

  return filterArr.map(({ originalIndex, ...rest }) => rest);
};
