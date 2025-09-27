"use client";
import { useBoolean } from "ahooks";
import { Button, Layout, Menu, MenuProps } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../icon";
import { useGetSessionSummary } from "../../hooks/session/useGetSessionSummary";
import useSessionStore from "../../store/session";
import clsx from "clsx";
import { SessionStatus, SessionTag } from "../../types/chat";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const DeskAssignedSession = () => {
  const { t } = useTranslation();
  const [collapsed, { toggle }] = useBoolean(false);
  const setFilterSummary = useSessionStore((state) => state.setFilterSummary);
  const { data: sessionSummary } = useGetSessionSummary();

  const menuItems = useMemo(() => {
    return [
      {
        label: t("active_sessions"),
        key: "ACTIVE_SESSIONS",
        icon: <Icon icon="chat-dot-o" size={20} />,
        children: [
          {
            label: t("unassigned"),
            key: SessionStatus.UNASSIGNED,
            icon: (
              <Icon icon="user-del-o" size={18} className="!text-amber-500" />
            ),
            onClick: () => {
              setFilterSummary({
                status: SessionStatus.UNASSIGNED,
                tag: undefined,
              });
            },
            itemIcon: !collapsed && (
              <span className="text-xs text-gray-500 ">
                {sessionSummary?.sessionStatuses?.find(
                  (s) => s.type === SessionStatus.UNASSIGNED
                )?.count || ""}
              </span>
            ),
          },
          {
            label: t("slow_processing"),
            key: SessionTag.SLOW_PROCESSING,
            icon: (
              <Icon
                icon="warning-square-o"
                size={18}
                className="!text-red-500"
              />
            ),
            onClick: () => {
              setFilterSummary({
                status: undefined,
                tag: SessionTag.SLOW_PROCESSING,
              });
            },
            itemIcon: !collapsed && (
              <span className="text-xs text-gray-500">
                {sessionSummary?.tagCounts?.find(
                  (s) => s.type === SessionTag.SLOW_PROCESSING
                )?.count || ""}
              </span>
            ),
          },
          {
            label: t("waiting_process"),
            key: SessionStatus.WAITING_PROCESS,
            icon: (
              <Icon
                icon="time-circle-o"
                size={18}
                className="!text-orange-400"
              />
            ),
            onClick: () => {
              setFilterSummary({
                status: SessionStatus.WAITING_PROCESS,
                tag: undefined,
              });
            },
            itemIcon: !collapsed && (
              <span className="text-xs text-gray-500">
                {sessionSummary?.sessionStatuses?.find(
                  (s) => s.type === SessionStatus.WAITING_PROCESS
                )?.count || ""}
              </span>
            ),
          },
          {
            label: t("awaiting_reply"),
            key: SessionTag.AWAITING_REPLY,
            icon: (
              <Icon
                icon="arrow-reply-o"
                size={18}
                className="!text-purple-500"
              />
            ),
            onClick: () => {
              setFilterSummary({
                status: undefined,
                tag: SessionTag.AWAITING_REPLY,
              });
            },
            itemIcon: !collapsed && (
              <span className="text-xs text-gray-500">
                {sessionSummary?.tagCounts?.find(
                  (s) => s.type === SessionTag.AWAITING_REPLY
                )?.count || ""}
              </span>
            ),
          },
          {
            label: t("in_process"),
            key: SessionStatus.IN_PROCESS,
            icon: <Icon icon="play-circle-o" size={18} />,
            onClick: () => {
              setFilterSummary({
                status: SessionStatus.IN_PROCESS,
                tag: undefined,
              });
            },
            itemIcon: !collapsed && (
              <span className="text-xs text-gray-500">
                {sessionSummary?.sessionStatuses?.find(
                  (s) => s.type === SessionStatus.IN_PROCESS
                )?.count || ""}
              </span>
            ),
          },
          {
            label: t("temporarily_paused"),
            key: SessionTag.TEMPORARILY_PAUSED,
            icon: <Icon icon="pause-o" size={18} />,
            onClick: () => {
              setFilterSummary({
                status: undefined,
                tag: SessionTag.TEMPORARILY_PAUSED,
              });
            },
            itemIcon: !collapsed && (
              <span className="text-xs text-gray-500">
                {sessionSummary?.tagCounts?.find(
                  (s) => s.type === SessionTag.TEMPORARILY_PAUSED
                )?.count || ""}
              </span>
            ),
          },
        ],
        itemIcon: !collapsed && (
          <span className="text-xs text-gray-500">
            {sessionSummary?.sessionStatuses?.find(
              (s) => s.type === SessionStatus.IN_PROCESS
            )?.count || ""}
          </span>
        ),
      },
      {
        label: t("closed_sessions"),
        key: "CLOSED_SESSIONS",
        icon: <Icon icon="check-square-o" size={20} />,
        onClick: () => {
          setFilterSummary({
            status: SessionStatus.COMPLETED,
            tag: undefined,
          });
        },
        itemIcon: !collapsed && (
          <span className="text-xs text-gray-500">
            {sessionSummary?.completedSessionCount || ""}
          </span>
        ),
      },
    ] as MenuItem[];
  }, [sessionSummary, t, collapsed]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggle}
      width={220}
      className="bg-white h-full border-r border-gray-200"
      trigger={null}
    >
      <div
        className={clsx(
          "flex items-center p-4 border-b",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <span className="text-md font-semibold flex-1 truncate">
            {"Droppii Staging"}
          </span>
        )}
        <Button
          type="text"
          shape="default"
          className="text-gray-500 w-8 h-8 p-0"
          onClick={toggle}
        >
          <Icon icon={collapsed ? "angle-right-o" : "angle-left-o"} size={22} />
        </Button>
      </div>
      <Menu
        defaultSelectedKeys={[SessionStatus.IN_PROCESS]}
        defaultOpenKeys={["ACTIVE_SESSIONS"]}
        mode="inline"
        items={menuItems}
        inlineIndent={12}
        expandIcon={
          <span className="text-xs text-gray-500">
            {sessionSummary?.activeSessionCount}
          </span>
        }
      />
    </Sider>
  );
};

export default DeskAssignedSession;
