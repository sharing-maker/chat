"use client";

import { useBoolean } from "ahooks";
import { Button, Drawer, Tabs, TabsProps } from "antd";
import { Icon } from "../icon";
import { useTranslation } from "react-i18next";
import ImageCollection from "./ImageCollection";
import VideoCollection from "./VideoCollection";
import { useIsMobile } from "../../hooks/common/useIsMobile";
import { useMemo } from "react";
import FileCollection from "./FileCollection";
import LinkCollection from "./LinkCollection";

export enum MediaCollectionTabKey {
  Image = "image",
  Video = "video",
  File = "file",
  Link = "link",
}

export const TOP_OFFSET = 128; /// HEADER + TAB HEIGHT

const MediaCollection = () => {
  const { t } = useTranslation();
  const [isOpen, { toggle }] = useBoolean(false);
  const isMobile = useIsMobile();

  const items: TabsProps["items"] = useMemo(() => {
    if (!isOpen) return [];
    return [
      {
        key: MediaCollectionTabKey.Image,
        label: t("image"),
        children: <ImageCollection />,
      },
      {
        key: MediaCollectionTabKey.Video,
        label: t("video"),
        children: <VideoCollection />,
      },
      {
        key: MediaCollectionTabKey.File,
        label: t("file"),
        children: <FileCollection />,
      },
      {
        key: MediaCollectionTabKey.Link,
        label: t("link"),
        children: <LinkCollection />,
      },
    ];
  }, [isOpen, t]);

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
            height: "100%",
          },
        }}
        getContainer={false}
        width={isMobile ? "100%" : 360}
      >
        <div className="flex flex-col h-full">
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
          <div className="flex-1 overflow-hidden">
            <Tabs
              defaultActiveKey={MediaCollectionTabKey.Image}
              items={items}
              className="h-full"
            />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MediaCollection;
