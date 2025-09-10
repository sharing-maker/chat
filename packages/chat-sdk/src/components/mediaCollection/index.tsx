"use client";

import { useBoolean } from "ahooks";
import { Button, Drawer, Tabs, TabsProps } from "antd";
import { Icon } from "../icon";
import { useTranslation } from "react-i18next";

export enum TabKey {
  Image = "image",
  Video = "video",
  File = "file",
  Link = "link",
}

const MediaCollection = () => {
  const { t } = useTranslation();
  const [isOpen, { toggle }] = useBoolean(false);

  const items: TabsProps["items"] = [
    {
      key: TabKey.Image,
      label: "Ảnh",
      children: "Content of Tab Pane 1",
    },
    {
      key: TabKey.Video,
      label: "Video",
      children: "Content of Tab Pane 2",
    },
    {
      key: TabKey.File,
      label: "Tập tin",
      children: "Content of Tab Pane 3",
    },
    {
      key: TabKey.Link,
      label: "Liên kết",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <>
      <Button
        type="text"
        shape="default"
        className="text-gray-500 w-8 h-8 p-0"
        onClick={toggle}
      >
        <Icon icon="folder-o" size={22} />
      </Button>
      <Drawer
        open={isOpen}
        onClose={toggle}
        mask={false}
        closeIcon={false}
        styles={{
          body: {
            padding: 0,
          },
        }}
        getContainer={false}
      >
        <div>
          <div className="flex items-center justify-between p-3">
            <span className="text-lg font-medium">{t("library")}</span>
            <Button
              type="text"
              shape="default"
              className="text-gray-500 w-8 h-8 p-0"
              onClick={toggle}
            >
              <Icon icon="close-b" size={22} />
            </Button>
          </div>
          <Tabs defaultActiveKey={TabKey.Image} items={items} />
        </div>
      </Drawer>
    </>
  );
};

export default MediaCollection;
