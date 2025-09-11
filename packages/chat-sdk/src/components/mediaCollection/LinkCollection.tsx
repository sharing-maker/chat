import { Empty } from "antd";
import { useTranslation } from "react-i18next";

const LinkCollection = () => {
  const { t } = useTranslation();

  return <Empty description={t("no_media_files")} />;
};

export default LinkCollection;
