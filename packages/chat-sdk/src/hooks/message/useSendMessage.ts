import { DChatSDK } from "../../constants/sdk";

interface SendMessageProps {
  recvID: string;
  groupID: string;
}

export const createTextMessage = async (text: string) => {
  console.log("createTextMessage", text);
  let textMessage = await DChatSDK.createTextMessage(
    text,
    new Date().getTime().toString()
  )
    .then(({ data }) => {
      console.log("createTextMessage", data);
      return data;
    })
    .catch(({ errCode, errMsg }) => {
      console.log("createTextMessage", errCode, errMsg);
      return null;
    });
  return textMessage;
};

export const useSendMessage = (props: SendMessageProps) => {
  const { recvID, groupID } = props;

  const sendTextMessage = async (text: string) => {
    let result = false;
    if (!recvID && !groupID) return false;
    const textMessage = await createTextMessage(text);
    if (!textMessage) return false;
    try {
      await DChatSDK.sendMessage(
        {
          recvID,
          groupID,
          message: textMessage,
        },
        new Date().getTime().toString()
      );
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
