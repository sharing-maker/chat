import { getSDK } from "@openim/wasm-client-sdk";
import { useChatContext } from "src/context/ChatContext";
const DChatSDK = getSDK();

interface SendMessageProps {
  recvID: string;
  groupID: string;
}

export const createTextMessage = async (text: string) => {
  let textMessage = await DChatSDK.createTextMessage(text)
    .then(({ data }) => {
      return data;
    })
    .catch(({ errCode, errMsg }) => {
      console.log("createTextMessage", errCode, errMsg);
      return null;
    });
  return textMessage;
};

export const useSendMessage = (props: SendMessageProps) => {
  const { user } = useChatContext();
  const { recvID, groupID } = props;

  const sendTextMessage = async (text: string) => {
    let result = false;
    if (!recvID && !groupID) return false;
    const textMessage = await createTextMessage(text);
    console.log("textMessage", textMessage);
    if (!textMessage) return false;
    try {
      await DChatSDK.sendMessage({
        recvID,
        groupID,
        message: textMessage,
      });
      result = true;
    } catch (error) {
      console.log("sendMessage", error);
    }
    return result;
  };

  return {
    sendTextMessage,
  };
};
