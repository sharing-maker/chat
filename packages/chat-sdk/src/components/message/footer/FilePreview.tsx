"use client";
import { useCallback } from "react";
import { useMessageFooterContext } from ".";
import { Button, UploadFile } from "antd";
import { Icon } from "../../icon";
import { documentIcon } from "../../../assets/svg";

const documentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
interface ShortenOptions {
  maxLength?: number;
  keepStart?: number;
  keepEnd?: number;
}

export const shortenFileName = (name: string, options: ShortenOptions = {}) => {
  const { maxLength = 20, keepStart = 8, keepEnd = 3 } = options;

  if (name.length <= maxLength) return name;

  const dotIndex = name.lastIndexOf(".");
  const ext = dotIndex !== -1 ? name.slice(dotIndex) : "";
  const base = dotIndex !== -1 ? name.slice(0, dotIndex) : name;

  // Tính toán độ dài phần đầu & cuối
  const available = maxLength - ext.length - 3; // trừ "...”
  const startLen = keepStart ?? Math.floor(available / 2);
  const endLen = keepEnd ?? Math.floor(available / 2);

  const start = base.slice(0, startLen);
  const end = base.slice(-endLen);

  return `${start}...${end}${ext}`;
};

const FilePreview = () => {
  const { listUploadFiles, setListUploadFiles } = useMessageFooterContext();

  const onRemoveFile = (file: UploadFile) => {
    setListUploadFiles(listUploadFiles.filter((f) => f.uid !== file.uid));
  };

  const renderFilePreview = useCallback(
    (file: UploadFile) => {
      const isDocument = documentTypes.includes(
        file?.originFileObj?.type || ""
      );
      const isVideo = file.type?.startsWith("video/");
      let src = file.url;
      if (!src && file.originFileObj) {
        src = URL.createObjectURL(file.originFileObj as File);
      }
      if (isDocument) {
        return (
          <div
            key={file.uid}
            className="relative flex flex-row items-center gap-2 align-center bg-gray-100 rounded-md p-1 pr-2"
          >
            {documentIcon}
            <span className="text-xs text-gray-500">
              {shortenFileName(file?.originFileObj?.name || "")}
            </span>
            <Button
              className="absolute top-[-8px] right-[-8px] w-5 h-5 rounded-full p-0 bg-gray-500 hover:bg-gray-600"
              type="primary"
              onClick={() => onRemoveFile(file)}
            >
              <Icon icon="close-b" size={12} color="white" />
            </Button>
          </div>
        );
      }
      return (
        <div key={file.uid} className="relative rounded-md border">
          {isVideo ? (
            <video
              src={src}
              className="w-[48px] h-[48px] object-cover rounded-lg"
              autoPlay={false}
            />
          ) : (
            <img
              src={src}
              alt={file.name}
              className="w-[48px] h-[48px] object-cover rounded-lg"
            />
          )}
          <Button
            className="absolute top-[-8px] right-[-8px] w-5 h-5 rounded-full p-0 bg-gray-500 hover:bg-gray-600"
            type="primary"
            onClick={() => onRemoveFile(file)}
          >
            <Icon icon="close-b" size={12} color="white" />
          </Button>
          {isVideo && (
            <Icon
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              icon="play-b"
              size={20}
              color="white"
            />
          )}
        </div>
      );
    },
    [listUploadFiles]
  );

  return (
    <div className="overflow-x-auto mb-[-4px]">
      <div className="border-b py-2 px-4">
        <div className="flex items-center gap-2">
          {listUploadFiles.map((file) => renderFilePreview(file))}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
