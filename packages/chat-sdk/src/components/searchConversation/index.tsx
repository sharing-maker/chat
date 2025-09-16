"use client";

import { Tabs, TabsProps } from "antd";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchConversationAll from "./SearchAll";
import SearchConversationAsUsers from "./SearchConversationAsUsers";
import SearchConversationAsMessages from "./SearchConversationAsMessages";

export enum SearchConversationTabKey {
  All = "all",
  Users = "users",
  Messages = "messages",
}

interface SearchConversationProps {
  searchTerm: string;
}
const SearchConversation = ({ searchTerm }: SearchConversationProps) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<SearchConversationTabKey>(
    SearchConversationTabKey.All
  );

  const items: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: SearchConversationTabKey.All,
        label: t("all"),
        children: (
          <SearchConversationAll
            searchTerm={searchTerm}
            setActiveKey={setActiveKey}
          />
        ),
      },
      {
        key: SearchConversationTabKey.Users,
        label: t("users"),
        children: <SearchConversationAsUsers searchTerm={searchTerm} />,
      },
      {
        key: SearchConversationTabKey.Messages,
        label: t("messages"),
        children: <SearchConversationAsMessages searchTerm={searchTerm} />,
      },
    ];
  }, [t, searchTerm]);

  return (
    <div className="h-full">
      <Tabs
        defaultActiveKey={SearchConversationTabKey.All}
        items={items}
        className="h-full"
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key as SearchConversationTabKey)}
      />
    </div>
  );
};

export default SearchConversation;
