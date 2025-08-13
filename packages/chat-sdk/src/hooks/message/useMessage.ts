import { useCallback, useEffect, useState } from "react";
import { getSDK, ViewType, AdvancedGetMessageResult } from '@openim/wasm-client-sdk';
const DChatSDK = getSDK();

const useMessage = (conversationId: string) => {
  const [dataMessages, setDataMessages] = useState<AdvancedGetMessageResult | null>(null);

  const getAdvancedHistoryMessageList = useCallback(() => {
    if (!conversationId) return
    DChatSDK.getSelfUserInfo()
    .then(({ data }) => {
      console.log('getSelfUserInfo', data)
    })
    .catch(({ errCode, errMsg }) => {
      console.log('getSelfUserInfo', errCode, errMsg)
    });
    DChatSDK.getAdvancedHistoryMessageList({
      conversationID: conversationId,
      count: 1000,
      startClientMsgID: '',
      viewType: ViewType.History
    }).then(({ data }) => {
      console.log('getAdvancedHistoryMessageList', data)
      setDataMessages(data)
    }).catch((err) => {
      console.log('getAdvancedHistoryMessageList', err)
    })
  }, [conversationId])

  useEffect(() => {
    getAdvancedHistoryMessageList()
  }, [getAdvancedHistoryMessageList])

  return {
    ...dataMessages,
  }
}

export default useMessage
