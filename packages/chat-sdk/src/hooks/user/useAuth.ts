import { DChatSDK } from "../../constants/sdk";

export const useDChatAuth = () => {
  const logout = async () => {
    const res = await DChatSDK.logout();
    return res;
  };

  return { logout };
};
