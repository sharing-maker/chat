import { Empty, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useSearchMessage } from "../../hooks/search/useSearchMessage";
import { MessageType } from "@openim/wasm-client-sdk";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchItemAsMessage from "./item/SearchItemAsMessage";

interface SearchConversationAsMessagesProps {
  searchTerm: string;
}
const SearchConversationAsMessages = (
  props: SearchConversationAsMessagesProps
) => {
  const { searchTerm = "" } = props;
  const { t } = useTranslation();
  const { dataFlatten, hasNextPage, fetchNextPage, isLoading } =
    useSearchMessage({
      searchTerm: searchTerm.trim(),
      contentType: MessageType.TextMessage,
    });

  if ((dataFlatten.length === 0 && !isLoading) || searchTerm.trim() === "")
    return <Empty description={t("no_conversation")} />;
  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spin />
      </div>
    );
  return (
    <div id="scrollableVideoDiv" className="h-full overflow-auto">
      <InfiniteScroll
        dataLength={dataFlatten.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className="flex items-center justify-center py-2">
            <Spin />
          </div>
        }
        scrollableTarget="scrollableVideoDiv"
      >
        {dataFlatten.map((item) => (
          <SearchItemAsMessage message={item.chatLog} searchTerm={searchTerm} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default SearchConversationAsMessages;
