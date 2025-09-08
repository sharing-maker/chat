import { useEffect } from "react";
import { DChatSDK } from "../../constants/sdk";
import {
  CbEvents,
  ConversationItem,
  MessageItem,
  MessageType,
  RevokedInfo,
  SessionType,
  WSEvent,
} from "@openim/wasm-client-sdk";
import { ConnectStatus, CustomType, SyncStatus } from "../../types/chat";
import { pushNewMessage, updateOneMessage } from "../message/useMessage";
import { useChatContext } from "../../context/ChatContext";
import useConversationStore from "../../store/conversation";

const notPushType = [MessageType.TypingMessage, MessageType.RevokeMessage];

export const useGlobalEvent = () => {
  const { user } = useChatContext();
  const { updateConnectStatus, updateSyncStatus } = useChatContext();
  const updateConversationList = useConversationStore(
    (state) => state.updateConversationList
  );
  const getConversationListByReq = useConversationStore(
    (state) => state.getConversationListByReq
  );

  const revokedMessageHandler = ({ data }: WSEvent<RevokedInfo>) => {
    updateOneMessage({
      clientMsgID: data.clientMsgID,
      contentType: MessageType.RevokeMessage,
      notificationElem: {
        detail: JSON.stringify(data),
      },
    } as MessageItem);
  };

  const inCurrentConversation = (newServerMsg: MessageItem) => {
    const selectedSourceId = useConversationStore.getState().selectedSourceId;
    switch (newServerMsg.sessionType) {
      case SessionType.Single:
        return (
          newServerMsg.sendID === selectedSourceId ||
          (user?.userID && newServerMsg.recvID === selectedSourceId)
        );
      case SessionType.Group:
      case SessionType.WorkingGroup:
        return newServerMsg.groupID === selectedSourceId;
      case SessionType.Notification:
        return newServerMsg.sendID === selectedSourceId;
      default:
        return false;
    }
  };

  const handleNewMessage = (newServerMsg: MessageItem) => {
    if (newServerMsg.contentType === MessageType.CustomMessage) {
      const customData = JSON.parse(newServerMsg.customElem!.data);
      if (
        CustomType.CallingInvite <= customData.customType &&
        customData.customType <= CustomType.CallingHungup
      ) {
        return;
      }
    }

    if (!inCurrentConversation(newServerMsg)) return;

    if (!notPushType.includes(newServerMsg.contentType)) {
      pushNewMessage(newServerMsg);
    }
  };

  const newMessageHandler = ({ data }: WSEvent<MessageItem[]>) => {
    data.map((message) => handleNewMessage(message));
  };

  const loginCheck = async () => {
    // check openIM token and user info
  };

  const connectingHandler = () => {
    updateConnectStatus(ConnectStatus.Connecting);
  };

  const connectSuccessHandler = () => {
    updateConnectStatus(ConnectStatus.Connected);
  };

  const connectFailedHandler = () => {
    updateConnectStatus(ConnectStatus.Disconnected);
  };

  const userTokenHandler = () => {
    useChatContext().userTokenHandler();
  };

  const syncStartHandler = ({ data }: WSEvent<boolean>) => {
    updateSyncStatus(SyncStatus.Loading);
  };

  const syncFinishHandler = () => {
    updateSyncStatus(SyncStatus.Success);
    // getFriendListByReq();
    // getGroupListByReq();
    getConversationListByReq(false);
    // getUnReadCountByReq();
  };
  const syncFailedHandler = () => {
    updateSyncStatus(SyncStatus.Failed);
  };

  const setIMListener = () => {
    //account
    DChatSDK.on(CbEvents.OnUserTokenExpired, userTokenHandler);
    DChatSDK.on(CbEvents.OnUserTokenInvalid, userTokenHandler);
    DChatSDK.on(CbEvents.OnConnecting, connectingHandler);
    DChatSDK.on(CbEvents.OnConnectSuccess, connectSuccessHandler);
    DChatSDK.on(CbEvents.OnConnectFailed, connectFailedHandler);

    // sync
    DChatSDK.on(CbEvents.OnSyncServerStart, syncStartHandler);
    // DChatSDK.on(CbEvents.OnSyncServerProgress, syncProgressHandler);
    DChatSDK.on(CbEvents.OnSyncServerFinish, syncFinishHandler);
    DChatSDK.on(CbEvents.OnSyncServerFailed, syncFailedHandler);

    // message
    DChatSDK.on(CbEvents.OnRecvNewMessages, newMessageHandler);
    DChatSDK.on(CbEvents.OnNewRecvMessageRevoked, revokedMessageHandler);

    // conversation
    DChatSDK.on(CbEvents.OnConversationChanged, conversationChangeHandler);
    DChatSDK.on(CbEvents.OnNewConversation, newConversationHandler);
  };

  const disposeIMListener = () => {
    //account
    DChatSDK.off(CbEvents.OnUserTokenExpired, userTokenHandler);
    DChatSDK.off(CbEvents.OnUserTokenInvalid, userTokenHandler);
    DChatSDK.off(CbEvents.OnConnecting, connectingHandler);
    DChatSDK.off(CbEvents.OnConnectSuccess, connectSuccessHandler);
    DChatSDK.off(CbEvents.OnConnectFailed, connectFailedHandler);

    // sync
    DChatSDK.off(CbEvents.OnSyncServerStart, syncStartHandler);
    // DChatSDK.off(CbEvents.OnSyncServerProgress, syncProgressHandler);
    DChatSDK.off(CbEvents.OnSyncServerFinish, syncFinishHandler);
    DChatSDK.off(CbEvents.OnSyncServerFailed, syncFailedHandler);

    // message
    DChatSDK.off(CbEvents.OnRecvNewMessages, newMessageHandler);

    // conversation
    DChatSDK.off(CbEvents.OnConversationChanged, conversationChangeHandler);
    DChatSDK.off(CbEvents.OnNewConversation, newConversationHandler);
  };

  // conversation
  const conversationChangeHandler = ({ data }: WSEvent<ConversationItem[]>) => {
    updateConversationList(data, "filter");
  };
  const newConversationHandler = ({ data }: WSEvent<ConversationItem[]>) => {
    updateConversationList(data, "push");
  };

  /** LIFE CYCLE */
  useEffect(() => {
    loginCheck();
    setIMListener();

    window.addEventListener("online", () => {
      DChatSDK.networkStatusChanged();
    });
    window.addEventListener("offline", () => {
      DChatSDK.networkStatusChanged();
    });
    return () => {
      disposeIMListener();
    };
  }, []);
};
