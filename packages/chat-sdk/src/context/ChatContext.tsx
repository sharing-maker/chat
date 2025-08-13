import { createContext, useContext, useEffect } from "react"
import { getSDK, InitAndLoginConfig } from '@openim/wasm-client-sdk';
import { ChatContextType, ChatProviderProps } from "@chat-sdk/types/chat";
const DChatSDK = getSDK();

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const useChatContext = () => {
  const context = useContext(ChatContext)
  // if (!context) {
  //   throw new Error("useChatContext must be used within a ChatProvider")
  // }
  return context
}

export const ChatProvider = ({
  children,
  config,
}: ChatProviderProps) => {

  const handleLogin = () => {
    DChatSDK.login(config as InitAndLoginConfig)
  }
  
  useEffect(() => {
    handleLogin()
  }, [config])
  
  return (
    <ChatContext.Provider value={{}}>
      {children}
    </ChatContext.Provider>
  )
}
