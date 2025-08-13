import { createContext, useContext, useEffect, useState } from "react"
import { getSDK, InitAndLoginConfig, SelfUserInfo } from '@openim/wasm-client-sdk';
import { ChatContextType, ChatProviderProps } from "@chat-sdk/types/chat";
const DChatSDK = getSDK();

export const ChatContext = createContext<ChatContextType>({
  user: null,
});

export const useChatContext = () => useContext(ChatContext)

export const ChatProvider = ({
  children,
  config,
}: ChatProviderProps) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<SelfUserInfo | null>(null)

  const getUserInfo = () => {
    DChatSDK.getSelfUserInfo().then(({ data }) => {
      setUser(data)
    }).catch(({ errCode, errMsg }) => {
      console.log('getSelfUserInfo', errCode, errMsg)
    })
  }

  const handleLogin = () => {
    DChatSDK.login(config as InitAndLoginConfig).then((res) => {
      getUserInfo()
      setLoading(false)
    }).catch(({ errCode, errMsg }) => {
      console.log('login', errCode, errMsg)
    })
  }

  useEffect(() => {
    handleLogin()
  }, [config])

  return (
    <ChatContext.Provider value={{ user }}>
      {!loading ? children : null}
    </ChatContext.Provider>
  )
}
