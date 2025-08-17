import { getSDK } from "@openim/wasm-client-sdk";
const DChatSDK = getSDK();

export const useDChatAuth = () => {
  const logout = async () => {
    const res = await DChatSDK.logout();
    return res;
  };

  return { logout };
};
