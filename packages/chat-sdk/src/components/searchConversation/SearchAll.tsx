import { Button, Empty, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchMessage } from "../../hooks/search/useSearchMessage";
import { MessageType } from "@openim/wasm-client-sdk";
import { Icon } from "../icon";
import SearchItemAsMessage from "./item/SearchItemAsMessage";
import { useGetSession } from "../../hooks/session/useGetSession";
import SearchItemAsUser from "./item/SearchItemAsUser";
import { SearchConversationTabKey } from ".";

interface SearchConversationAllProps {
  searchTerm: string;
  setActiveKey: (key: SearchConversationTabKey) => void;
}
const SearchConversationAll = ({
  searchTerm = "",
  setActiveKey,
}: SearchConversationAllProps) => {
  const { t } = useTranslation();
  const {
    dataFlatten: messages,
    isLoading: isLoadingMessage,
    hasNextPage: hasNextPageMessage,
  } = useSearchMessage({
    payload: {
      searchTerm: searchTerm.trim(),
      contentType: MessageType.TextMessage,
    },
    options: { pageSize: 5 },
  });
  const {
    dataFlatten: sessions,
    isLoading: isLoadingSession,
    hasNextPage: hasNextPageSession,
  } = useGetSession(
    {
      searchTerm: searchTerm.trim(),
    },
    { pageSize: 5 }
  );

  if (
    searchTerm.trim() === "" ||
    (messages.length === 0 && sessions.length === 0)
  ) {
    return (
      <div className="h-full overflow-auto">
        <Empty description={t("no_conversation")} />
      </div>
    );
  }

  if (isLoadingMessage || isLoadingSession) {
    return (
      <div className="h-full overflow-auto flex items-center justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      {sessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-3">
            <span className="text-xs font-medium uppercase flex-1 text-gray-600">
              {t("users")}
            </span>
            {hasNextPageMessage && (
              <Button
                type="link"
                icon={
                  <Icon
                    icon="angle-right-o"
                    size={18}
                    className="!align-[-4px]"
                  />
                }
                iconPosition="end"
                className="p-0 gap-1"
                onClick={() => setActiveKey?.(SearchConversationTabKey.Users)}
              >
                {t("see_more")}
              </Button>
            )}
          </div>
          <div>
            {sessions.map((session) => (
              <SearchItemAsUser session={session} searchTerm={searchTerm} />
            ))}
          </div>
        </div>
      )}
      {messages.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-3">
            <span className="text-xs font-medium uppercase flex-1 text-gray-600">
              {t("messages")}
            </span>
            {hasNextPageSession && (
              <Button
                type="link"
                icon={
                  <Icon
                    icon="angle-right-o"
                    size={18}
                    className="!align-[-4px]"
                  />
                }
                iconPosition="end"
                className="p-0 gap-1"
                onClick={() =>
                  setActiveKey?.(SearchConversationTabKey.Messages)
                }
              >
                {t("see_more")}
              </Button>
            )}
          </div>
          <div>
            {messages.map((message) => (
              <SearchItemAsMessage
                message={message.chatLog}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchConversationAll;
