import { getSDK, ConversationItem } from '@openim/wasm-client-sdk';
import { useCallback, useEffect, useState } from 'react';
const DChatSDK = getSDK();

export const useConversationList = () => {
  const [conversationList, setConversationList] = useState<ConversationItem[]>([]);

  const getAllConversationList = useCallback(async () => {
    DChatSDK.getAllConversationList().then(({ data }) => {
      console.log('getAllConversationList', data)
      setConversationList(data)
    }).catch((err) => {
      console.log('getAllConversationList', err)
    })
  }, [])

  const getOneConversation = useCallback(async () => {
    DChatSDK.getOneConversation({
      sourceID: '3408237279',
      sessionType: 3
    }).then(({ data }) => {
      console.log('getOneConversation', data)
    }).catch((err) => {
      console.log('getOneConversation', err)
    })
  }, [])
  useEffect(() => {
    getAllConversationList()
    getOneConversation()
  }, [getAllConversationList])

  return {
    conversationList,
  }
}
