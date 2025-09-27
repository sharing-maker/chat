"use client";

import { Avatar, Button } from "antd";
import { Icon } from "../icon";
import { useConversationDisplayData } from "../../hooks/conversation/useConversation";
import useConversationStore from "../../store/conversation";
import MediaCollection from "../mediaCollection";
import { useGetSession } from "../../hooks/session/useGetSession";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SessionStatus, SessionTag } from "../../types/chat";
import SelectSession from "./SelectSession";

interface MessageHeaderProps {
  onClose?: () => void;
}

type SelectSessionValueType = SessionStatus | SessionTag;

export interface SelectSessionOption {
  label: string;
  value: SelectSessionValueType;
  tintColorClassname: string;
  bgTintColorClassname: string;
}

const MessageHeader = ({ onClose }: MessageHeaderProps) => {
  const { t } = useTranslation();
  const conversationData = useConversationStore(
    (state) => state.conversationData
  );
  const { dataFlatten: sessions } = useGetSession({
    conversationIds: conversationData?.conversationID
      ? [conversationData.conversationID]
      : [],
  });

  const { avatar, displayName } = useConversationDisplayData(conversationData);

  const currentSession = useMemo(() => {
    return sessions?.find(
      (session) => session.conversationId === conversationData?.conversationID
    );
  }, [sessions, conversationData]);

  const statusOptions: SelectSessionOption[] = useMemo(() => {
    return [
      {
        label: t("unassigned"),
        value: SessionStatus.UNASSIGNED,
        tintColorClassname: "amber-500",
        bgTintColorClassname: "amber-100",
      },
      {
        label: t("waiting_process"),
        value: SessionStatus.WAITING_PROCESS,
        tintColorClassname: "orange-500",
        bgTintColorClassname: "orange-100",
      },
      {
        label: t("in_process"),
        value: SessionStatus.IN_PROCESS,
        tintColorClassname: "blue-500",
        bgTintColorClassname: "blue-100",
      },
      {
        label: t("completed"),
        value: SessionStatus.COMPLETED,
        tintColorClassname: "green-500",
        bgTintColorClassname: "green-100",
      },
    ];
  }, [t]);

  return (
    <div className="px-4 py-3 flex items-center border-b gap-3 bg-white">
      <Avatar src={avatar} size={"large"}>
        {displayName?.charAt?.(0) || "A"}
      </Avatar>
      <div className="flex flex-col">
        <p className="text-base truncate">{displayName || ""}</p>
        <p className="text-xs text-gray-500">{"2 thành viên"}</p>
      </div>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <SelectSession
          options={statusOptions}
          value={currentSession?.status || SessionStatus.IN_PROCESS}
          onChange={(value) => {}}
        />
        <Button
          type="text"
          shape="default"
          className="text-gray-500 w-8 h-8 p-0"
        >
          <Icon icon="search-o" size={22} />
        </Button>
        <MediaCollection />
        <Button
          type="text"
          shape="default"
          className="text-gray-500 w-8 h-8 p-0"
        >
          <Icon icon="align-justify-o" size={22} />
        </Button>
        {!!onClose && (
          <Button
            type="text"
            shape="default"
            className="text-gray-500 w-8 h-8 p-0"
            onClick={onClose}
          >
            <Icon icon="close-b" size={22} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageHeader;
