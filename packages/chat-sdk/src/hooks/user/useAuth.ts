import { Platform } from "@openim/wasm-client-sdk";
import { DChatSDK } from "../../constants/sdk";
import useAuthStore from "../../store/auth";
import useConversationStore from "../../store/conversation";
import { DChatApplicationType } from "../../types/chat";

export const useDChatAuth = () => {
  const initAuthStore = useAuthStore((state) => state.initAuthStore);
  const resetConversationStore = useConversationStore(
    (state) => state.resetConversationStore
  );
  const logout = async () => {
    await Promise.resolve(resetConversationStore());
    await Promise.resolve(
      initAuthStore({
        chatToken: "",
        accessToken: "",
        apiAddress: "",
        wsAddress: "",
        platformID: Platform.Web,
        userID: "",
        applicationType: DChatApplicationType.OBEFE,
      })
    );
    const res = await DChatSDK.logout();

    return res;
  };

  return { logout };
};
