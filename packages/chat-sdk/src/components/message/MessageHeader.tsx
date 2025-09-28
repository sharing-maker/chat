"use client";

import { Avatar, Button, message } from "antd";
import { Icon } from "../icon";
import { useConversationDisplayData } from "../../hooks/conversation/useConversation";
import useConversationStore from "../../store/conversation";
import MediaCollection from "../mediaCollection";
import { useGetSession } from "../../hooks/session/useGetSession";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SessionStatus, SessionTag } from "../../types/chat";
import SelectSession from "./SelectSession";
import { useUpdateSession } from "../../hooks/session/useUpdateSession";
import emitter from "../../utils/events";
import { UpdateSessionResponse } from "../../types/dto";
import { useChatContext } from "../../context/ChatContext";
import { adminUserId } from "../../constants";

interface MessageHeaderProps {
  onClose?: () => void;
}

type SelectSessionValueType = SessionStatus | SessionTag;

export interface SelectSessionOption {
  label: string;
  value: SelectSessionValueType;
  tintColorClassname: string;
  tintColorClassnameBg: string;
  bgTintColorClassname: string;
}

const MessageHeader = ({ onClose }: MessageHeaderProps) => {
  const { t } = useTranslation();
  const { user } = useChatContext();
  const conversationData = useConversationStore(
    (state) => state.conversationData
  );
  const { dataFlatten: sessions, refetch: refetchSession } = useGetSession({
    conversationIds: conversationData?.conversationID
      ? [conversationData.conversationID]
      : [],
  });
  const { mutate: updateSession } = useUpdateSession();

  const { avatar, displayName } = useConversationDisplayData(conversationData);

  const [currentSessionStatus, setCurrentSessionStatus] =
    useState<SelectSessionValueType>(SessionStatus.UNASSIGNED);
  const [currentSessionTag, setCurrentSessionTag] =
    useState<SelectSessionValueType>(SessionTag.NONE);

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
        tintColorClassname: "text-amber-500",
        tintColorClassnameBg: "bg-amber-500",
        bgTintColorClassname: "bg-amber-100",
      },
      {
        label: t("waiting_process"),
        value: SessionStatus.WAITING_PROCESS,
        tintColorClassname: "text-orange-500",
        tintColorClassnameBg: "bg-orange-500",
        bgTintColorClassname: "bg-orange-100",
      },
      {
        label: t("in_process"),
        value: SessionStatus.IN_PROCESS,
        tintColorClassname: "text-blue-500",
        tintColorClassnameBg: "bg-blue-500",
        bgTintColorClassname: "bg-blue-100",
      },
      {
        label: t("completed"),
        value: SessionStatus.COMPLETED,
        tintColorClassname: "text-green-500",
        tintColorClassnameBg: "bg-green-500",
        bgTintColorClassname: "bg-green-100",
      },
    ];
  }, [t]);

  const tagOptions: SelectSessionOption[] = useMemo(() => {
    return [
      {
        label: t("awaiting_reply"),
        value: SessionTag.AWAITING_REPLY,
        tintColorClassname: "text-purple-500",
        tintColorClassnameBg: "bg-purple-500",
        bgTintColorClassname: "bg-purple-100",
      },
      {
        label: t("slow_processing"),
        value: SessionTag.SLOW_PROCESSING,
        tintColorClassname: "text-red-500",
        tintColorClassnameBg: "bg-red-500",
        bgTintColorClassname: "bg-red-100",
      },
      {
        label: t("temporarily_paused"),
        value: SessionTag.TEMPORARILY_PAUSED,
        tintColorClassname: "text-gray-500",
        tintColorClassnameBg: "bg-gray-500",
        bgTintColorClassname: "bg-gray-100",
      },
    ];
  }, [t]);

  const handleUpdateSession = (
    value: SelectSessionValueType,
    type: "status" | "tag"
  ) => {
    if (currentSession) {
      updateSession(
        {
          sessionId: currentSession.id,
          [type]: value,
        },
        {
          onError(error: any) {
            message.error(
              error?.response?.data?.message ||
                t(`update_session_${type}_failed`)
            );
          },
          onSuccess() {
            if (type === "status") {
              setCurrentSessionStatus(value);
            } else {
              setCurrentSessionTag(value);
            }
          },
        }
      );
    }
  };

  useEffect(() => {
    if (currentSession) {
      setCurrentSessionTag(currentSession.tag);
      setCurrentSessionStatus(currentSession.status);
    }
  }, [currentSession]);

  useEffect(() => {
    emitter.on("UPDATE_SESSION", (sessionUpdated: UpdateSessionResponse) => {
      if (sessionUpdated.conversationId === conversationData?.conversationID) {
        refetchSession();
      }
    });
    return () => {
      emitter.off("UPDATE_SESSION", () => {
        refetchSession();
      });
    };
  }, [conversationData?.conversationID]);

  return (
    <div className="px-4 py-3 flex items-center border-b gap-3 bg-white no-transform">
      <Avatar src={avatar} size={"large"}>
        {displayName?.charAt?.(0) || "A"}
      </Avatar>
      <div className="flex flex-col">
        <p className="text-base truncate">{displayName || ""}</p>
        <p className="text-xs text-gray-500">{"2 thành viên"}</p>
      </div>
      <div className="flex items-center gap-2 flex-1 justify-end">
        {currentSessionTag !== SessionTag.NONE &&
          user?.userID === adminUserId && (
            <SelectSession
              options={tagOptions}
              value={currentSessionTag}
              onChange={(value) => handleUpdateSession(value, "tag")}
            />
          )}
        {user?.userID === adminUserId && (
          <SelectSession
            options={statusOptions}
            value={currentSessionStatus}
            onChange={(value) => handleUpdateSession(value, "status")}
          />
        )}
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
