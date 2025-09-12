import { Empty } from "antd";
import { useTranslation } from "react-i18next";

const SearchConversationAll = () => {
  const { t } = useTranslation();

  return <Empty description={t("no_conversation")} />;
};

export default SearchConversationAll;
