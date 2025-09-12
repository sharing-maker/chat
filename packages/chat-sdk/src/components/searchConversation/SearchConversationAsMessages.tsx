import { Empty } from "antd";
import { useTranslation } from "react-i18next";

const SearchConversationAsMessages = () => {
  const { t } = useTranslation();

  return <Empty description={t("no_conversation")} />;
};

export default SearchConversationAsMessages;
