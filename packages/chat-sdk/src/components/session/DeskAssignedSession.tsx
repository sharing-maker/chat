"use client";
import { useBoolean } from "ahooks";
import { Button, Layout, Menu, MenuProps } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SESSION_STATUS_ENUM, TAG_ENUM } from "../../constants";
import { Icon } from "../icon";
import { useGetSessionSummary } from "../../hooks/session/useGetSessionSummary";
import useSessionStore from "../../store/session";
import clsx from "clsx";

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
            key: SESSION_STATUS_ENUM.UNASSIGNED,
            icon: (
              <Icon icon="user-del-o" size={18} className="!text-amber-500" />
            ),
            onClick: () => {
              setFilterSummary({
                status: SESSION_STATUS_ENUM.UNASSIGNED,
                tag: undefined,
              });
            },
            extra: (
              <span className="text-xs text-gray-500">
                {sessionSummary?.sessionStatuses?.find(
                  (s) => s.type === SESSION_STATUS_ENUM.UNASSIGNED
                )?.count || ""}
              </span>
            ),
          },
          {
            label: t("slow_processing"),
            key: TAG_ENUM.SLOW_PROCESSING,
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
                tag: TAG_ENUM.SLOW_PROCESSING,
              });
            },
            extra: (
              <span className="text-xs text-gray-500">
                {sessionSummary?.tagCounts?.find(
                  (s) => s.type === TAG_ENUM.SLOW_PROCESSING
                )?.count || ""}
              </span>
            ),
          },
          {
            label: t("waiting_process"),
            key: SESSION_STATUS_ENUM.WAITING_PROCESS,
            icon: (
              <Icon
                icon="time-circle-o"
                size={18}
                className="!text-orange-400"
              />
            ),
            onClick: () => {
              setFilterSummary({
                status: SESSION_STATUS_ENUM.WAITING_PROCESS,
                tag: undefined,
              });
            },
            extra: (
              <span className="text-xs text-gray-500">
                {sessionSummary?.sessionStatuses?.find(
                  (s) => s.type === SESSION_STATUS_ENUM.WAITING_PROCESS
                )?.count || ""}
              </span>
            ),
          },
          {
            label: t("awaiting_reply"),
            key: TAG_ENUM.AWAITING_REPLY,
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
                tag: TAG_ENUM.AWAITING_REPLY,
              });
            },
            extra: (
              <span className="text-xs text-gray-500">
                {sessionSummary?.tagCounts?.find(
                  (s) => s.type === TAG_ENUM.AWAITING_REPLY
                )?.count || ""}
              </span>
            ),
          },
          {
            label: t("in_process"),
            key: SESSION_STATUS_ENUM.IN_PROCESS,
            icon: <Icon icon="play-circle-o" size={18} />,
            onClick: () => {
              setFilterSummary({
                status: SESSION_STATUS_ENUM.IN_PROCESS,
                tag: undefined,
              });
            },
            extra: (
              <span className="text-xs text-gray-500">
                {sessionSummary?.sessionStatuses?.find(
                  (s) => s.type === SESSION_STATUS_ENUM.IN_PROCESS
                )?.count || ""}
              </span>
            ),
          },
          {
            label: t("temporarily_paused"),
            key: TAG_ENUM.TEMPORARILY_PAUSED,
            icon: <Icon icon="pause-o" size={18} />,
            onClick: () => {
              setFilterSummary({
                status: undefined,
                tag: TAG_ENUM.TEMPORARILY_PAUSED,
              });
            },
            extra: (
              <span className="text-xs text-gray-500">
                {sessionSummary?.tagCounts?.find(
                  (s) => s.type === TAG_ENUM.TEMPORARILY_PAUSED
                )?.count || ""}
              </span>
            ),
          },
        ],
        extra: (
          <span className="text-xs text-gray-500">
            {sessionSummary?.sessionStatuses?.find(
              (s) => s.type === SESSION_STATUS_ENUM.IN_PROCESS
            )?.count || "100"}
          </span>
        ),
      },
      {
        label: (
          <div className="flex items-center gap-2">
            <span className="ant-menu-title-content ant-menu-title-content-with-extra flex-1">
              {t("closed_sessions")}
            </span>
            <span className="text-xs text-gray-500">
              {sessionSummary?.completedSessionCount || ""}
            </span>
          </div>
        ),
        key: "CLOSED_SESSIONS",
        icon: <Icon icon="check-square-o" size={20} />,
        onClick: () => {
          setFilterSummary({
            status: SESSION_STATUS_ENUM.COMPLETED,
            tag: undefined,
          });
        },
      },
    ] as MenuItem[];
  }, [sessionSummary]);

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
        defaultSelectedKeys={[SESSION_STATUS_ENUM.IN_PROCESS]}
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
