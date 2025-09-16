import { Empty, Spin } from "antd";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchItemAsUser from "./item/SearchItemAsUser";
import { useGetSession } from "../../hooks/session/useGetSession";

interface SearchConversationAsUsersProps {
  searchTerm: string;
}
const SearchConversationAsUsers = (props: SearchConversationAsUsersProps) => {
  const { searchTerm = "" } = props;
  const { t } = useTranslation();
  const { dataFlatten, hasNextPage, fetchNextPage, isLoading } = useGetSession({
    searchTerm: searchTerm.trim(),
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
          <SearchItemAsUser session={item} searchTerm={searchTerm} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default SearchConversationAsUsers;
