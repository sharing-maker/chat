"use client";

import { Tabs, TabsProps } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import SearchConversationAll from "./SearchAll";
import SearchConversationAsUsers from "./SearchConversationAsUsers";
import SearchConversationAsMessages from "./SearchConversationAsMessages";

export enum SearchConversationTabKey {
  All = "all",
  Users = "users",
  Messages = "messages",
}

const SearchConversation = () => {
  const { t } = useTranslation();

  const items: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: SearchConversationTabKey.All,
        label: t("all"),
        children: <SearchConversationAll />,
      },
      {
        key: SearchConversationTabKey.Users,
        label: t("users"),
        children: <SearchConversationAsUsers />,
      },
      {
        key: SearchConversationTabKey.Messages,
        label: t("messages"),
        children: <SearchConversationAsMessages />,
      },
    ];
  }, [t]);

  return (
    <div>
      <Tabs defaultActiveKey={SearchConversationTabKey.All} items={items} />
    </div>
  );
};

export default SearchConversation;
