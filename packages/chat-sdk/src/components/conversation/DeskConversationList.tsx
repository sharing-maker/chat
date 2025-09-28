"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Input, Empty, Drawer, Button, InputRef, Spin } from "antd";
import { Icon } from "../icon";
import useConversationStore from "../../store/conversation";
import { useTranslation } from "react-i18next";
import { useBoolean, useDebounce } from "ahooks";
import SearchConversation from "../searchConversation";
import useSessionStore from "../../store/session";
import InfiniteScroll from "react-infinite-scroll-component";
import ConversationBySessionItem from "./ConversationBySessionItem";
import { ConversationItem } from "@openim/wasm-client-sdk";
import { useGetSession } from "../../hooks/session/useGetSession";
import { DChatSDK } from "../../constants/sdk";
import emitter from "../../utils/events";
import { UpdateSessionResponse } from "../../types/dto";

const DeskConversationList = () => {
  const searchInputRef = useRef<InputRef>(null);
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [
    showSearch,
    { setTrue: setShowSearchTrue, setFalse: setShowSearchFalse },
  ] = useBoolean(false);

  const searchParams = useSearchParams();
  const setConversationData = useConversationStore(
    (state) => state.setConversationData
  );
  const setSelectedConversationId = useConversationStore(
    (state) => state.setSelectedConversationId
  );
  const conversationList = useConversationStore(
    (state) => state.conversationList
  );
  const updateConversationList = useConversationStore(
    (state) => state.updateConversationList
  );

  const filterSummary = useSessionStore((state) => state.filterSummary);

  const {
    dataFlatten: sessions,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetSession(filterSummary);

  const debouncedSearch = useDebounce(search, { wait: 500 });

  const onCloseSearch = () => {
    setSearch("");
    setShowSearchFalse();
    setTimeout(() => {
      searchInputRef.current?.blur();
    }, 500);
  };

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [showSearch]);

  useEffect(() => {
    const threadId = searchParams.get("threadId");
    if (threadId) {
      setSelectedConversationId(threadId);
      const selectedConversation = conversationList.find(
        (conv: ConversationItem) => conv.conversationID === threadId
      );
      if (selectedConversation) {
        setConversationData(selectedConversation);
      } else {
        DChatSDK.getMultipleConversation([threadId]).then((res) => {
          if (res.data.length > 0) {
            setConversationData(res.data[0]);
            updateConversationList(res.data, "filter");
          }
        });
      }
    }
  }, [searchParams, conversationList]);

  useEffect(() => {
    emitter.on("UPDATE_SESSION", (sessionUpdated: UpdateSessionResponse) => {
      if (
        sessionUpdated.status !== filterSummary.status ||
        sessionUpdated.tag !== filterSummary.tag
      ) {
        refetch();
      }
    });
    return () => {
      emitter.off("UPDATE_SESSION", () => {
        refetch();
      });
    };
  }, [filterSummary]);

  return (
    <div
      className={`flex flex-col h-full bg-white border-r border-gray-200 w-[320px]`}
    >
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Input
            ref={searchInputRef}
            placeholder={t("search")}
            prefix={
              <Icon icon="search-o" size={18} className="text-gray-400" />
            }
            onChange={(e) => {
              if (!showSearch && e.target.value) {
                setShowSearchTrue();
              }
              setSearch(e.target.value);
            }}
            className="rounded-lg text-sm flex-1 h-[36px]"
            size="large"
            allowClear
            onClick={setShowSearchTrue}
            value={search}
            autoFocus={false}
            onClear={onCloseSearch}
          />
          {showSearch && (
            <Button
              onClick={onCloseSearch}
              variant="outlined"
              className="p-0 w-[36px] h-[36px] text-gray-500"
            >
              <Icon icon="close-b" size={22} />
            </Button>
          )}
        </div>
      </div>

      <div
        id="scrollableConversationsDiv"
        style={{
          height: "100%",
          overflow: "auto",
          position: "relative",
        }}
      >
        <InfiniteScroll
          dataLength={sessions?.length || 0}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="flex items-center justify-center py-2">
              <Spin />
            </div>
          }
          scrollableTarget="scrollableConversationsDiv"
        >
          {sessions?.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Empty
                image={
                  <Icon
                    icon="chat-square-b"
                    size={80}
                    className="text-gray-300"
                  />
                }
                description={t("no_conversation")}
              />
            </div>
          ) : (
            sessions?.map?.((session) => (
              <ConversationBySessionItem
                key={session.conversationId}
                sessionItem={session}
              />
            ))
          )}
        </InfiniteScroll>
        <Drawer
          open={showSearch}
          mask={false}
          closeIcon={false}
          styles={{
            body: {
              padding: 0,
            },
          }}
          getContainer={false}
          width={"100%"}
        >
          <SearchConversation searchTerm={debouncedSearch} />
        </Drawer>
      </div>
    </div>
  );
};

export default DeskConversationList;
