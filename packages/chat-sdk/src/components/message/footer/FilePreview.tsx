"use client";
import { useCallback } from "react";
import { useMessageFooterContext } from ".";
import { Button, UploadFile } from "antd";
import { Icon } from "../../icon";

const documentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const documentIcon = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.1923 5.83301L23.4363 5.83301L34.1656 14.2054V29.8639C34.1656 31.8997 32.5286 34.1663 29.8068 34.1663C27.0849 34.1663 10.1923 34.1663 10.1923 34.1663C7.4704 34.1663 5.8335 31.8997 5.8335 29.8639V10.0305C5.8335 7.99475 7.4704 5.83301 10.1923 5.83301Z"
      fill="#24B0FF"
    ></path>
    <path
      d="M10.8335 28.1394V20.833H16.0309V22.4222H12.7026V23.5916H15.3612V25.1708H12.7026V28.1394H10.8335Z"
      fill="#edf6ff"
    ></path>
    <path
      d="M19.0073 28.0885V20.833H20.8613V26.5118H24.0146V28.0885L19.0073 28.0885Z"
      fill="#edf6ff"
    ></path>
    <path
      d="M16.5918 28.1001V20.833H18.4485V28.1001H16.5918Z"
      fill="#edf6ff"
    ></path>
    <path
      d="M24.5737 20.833V28.1393H29.7723V26.5573H26.439L26.4422 25.1708H29.1017V23.5916H26.4422V22.4222H29.7723V20.833H24.5737Z"
      fill="#edf6ff"
    ></path>
    <path
      opacity="0.302"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M23.2686 5.83301V14.2281H34.1655L23.2686 5.83301Z"
      fill="#edf6ff"
    ></path>
  </svg>
);

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
      const isDocument = documentTypes.includes(file.type || "");
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
              {shortenFileName(file.name)}
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
    <div className="overflow-x-auto">
      <div className="border-b py-2 px-4">
        <div className="flex items-center gap-2">
          {listUploadFiles.map((file) => renderFilePreview(file))}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
