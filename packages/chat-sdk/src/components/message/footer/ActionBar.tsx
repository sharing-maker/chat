"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Upload,
  GetProp,
  UploadProps,
  message,
  UploadFile,
} from "antd";
import clsx from "clsx";
import EmojiPicker from "./EmojiPicker";
import { Icon } from "../../icon";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $isQuoteNode } from "@lexical/rich-text";
import { useMessageFooterContext } from ".";
import { UploadChangeParam } from "antd/es/upload";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const documentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const EmojiIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 8.39997C14 8.8418 13.6418 9.19997 13.2 9.19997C12.7581 9.19997 12.4 8.8418 12.4 8.39997C12.4 7.95814 12.7581 7.59997 13.2 7.59997C13.6418 7.59997 14 7.95814 14 8.39997Z"
      fill="white"
    ></path>
    <path
      d="M7.59997 8.39997C7.59997 8.8418 7.2418 9.19997 6.79997 9.19997C6.35814 9.19997 5.99997 8.8418 5.99997 8.39997C5.99997 7.95814 6.35814 7.59997 6.79997 7.59997C7.2418 7.59997 7.59997 7.95814 7.59997 8.39997Z"
      fill="white"
    ></path>
    <path
      d="M7.59997 12.4C7.59997 12.4 8.49997 13.2 9.99997 13.2C11.5 13.2 12.4 12.4 12.4 12.4M14 8.39997C14 8.8418 13.6418 9.19997 13.2 9.19997C12.7581 9.19997 12.4 8.8418 12.4 8.39997C12.4 7.95814 12.7581 7.59997 13.2 7.59997C13.6418 7.59997 14 7.95814 14 8.39997ZM18 9.99997C18 14.4182 14.4182 18 9.99997 18C5.58169 18 1.99997 14.4182 1.99997 9.99997C1.99997 5.58169 5.58169 1.99997 9.99997 1.99997C14.4182 1.99997 18 5.58169 18 9.99997ZM7.59997 8.39997C7.59997 8.8418 7.2418 9.19997 6.79997 9.19997C6.35814 9.19997 5.99997 8.8418 5.99997 8.39997C5.99997 7.95814 6.35814 7.59997 6.79997 7.59997C7.2418 7.59997 7.59997 7.95814 7.59997 8.39997Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
);

const ActionBar = () => {
  const [editor] = useLexicalComposerContext();
  const { onSendMessage, setListUploadFiles } = useMessageFooterContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { listUploadFiles } = useMessageFooterContext();

  const handleSend = useCallback(() => {
    let plainText = "";
    let richText = "";

    // lấy plain text & html
    editor.getEditorState().read(() => {
      plainText = $getRoot().getTextContent();
      richText = $generateHtmlFromNodes(editor);
    });

    if (plainText.trim().length > 0 || listUploadFiles.length > 0) {
      onSendMessage({
        plainText,
        richText,
        type: listUploadFiles.length > 0 ? "file" : "text",
      });
    }

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      const paragraph = $createParagraphNode();
      root.append(paragraph);
      paragraph.select();

      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const topLevelNode = anchorNode.getTopLevelElementOrThrow();
        const isListNode = $isListNode(topLevelNode);
        const isQuoteNode = $isQuoteNode(topLevelNode);
        const listType = isListNode ? topLevelNode.getListType() : undefined;

        if (selection.hasFormat("bold")) {
          selection.formatText("bold");
        }
        if (selection.hasFormat("italic")) {
          selection.formatText("italic");
        }
        if (selection.hasFormat("strikethrough")) {
          selection.formatText("strikethrough");
        }
        if (isQuoteNode) {
          // Nếu đang là QuoteNode → chuyển về Paragraph (bình thường)
          const paragraph = $createParagraphNode();
          // copy con của quote sang paragraph
          const children = topLevelNode.getChildren();
          children.forEach((child) => paragraph.append(child));
          topLevelNode.replace(paragraph);
        }
        if (isListNode && listType) {
          editor.dispatchCommand(
            listType === "number"
              ? INSERT_ORDERED_LIST_COMMAND
              : INSERT_UNORDERED_LIST_COMMAND,
            undefined
          );
        }
      }
    });
  }, [editor, onSendMessage]);

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertText(emoji); // chèn emoji như text bình thường
        }
      });
      setShowEmojiPicker(false);
    },
    [editor]
  );

  const beforeUploadImagesAndVideo = (file: File, fileList: UploadFile[]) => {
    const isImage =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";

    const isVideo = file.type.startsWith("video/");

    // check format
    if (!isImage && !isVideo) {
      message.error(
        `${file.name} không đúng định dạng JPG, JPEG, PNG hoặc VIDEO`
      );
      return Upload.LIST_IGNORE;
    }

    // check size
    const maxSize = isImage ? 5 : 200; // MB
    if (file.size / 1024 / 1024 > maxSize) {
      message.error(`${file.name} có kích thước tập tin vượt quá ${maxSize}MB`);
      return Upload.LIST_IGNORE;
    }

    // nếu là video thì chỉ cho 1 cái duy nhất
    if (isVideo) {
      const hasVideo = listUploadFiles.some(
        (f) => f.type?.startsWith("video/")
      );
      if (hasVideo) {
        message.error("Chỉ được phép tải lên 1 video duy nhất");
        return Upload.LIST_IGNORE;
      }
    }

    return true;
  };

  const beforeUploadFile = (file: File) => {
    const isAllowed = documentTypes.includes(file.type);
    if (!isAllowed) {
      message.error(
        `${file.name} không đúng định dạng (chỉ hỗ trợ PDF, DOC, DOCX)`
      );
    }
    return isAllowed;
  };

  const handleChange = (info: UploadChangeParam) => {
    let newList = [...info.fileList];

    // Nếu file mới là tài liệu -> chỉ giữ 1 cái (file cuối)
    const lastFile = info.file;
    if (documentTypes.includes(lastFile.type || "")) {
      newList = newList.filter(
        (f) => documentTypes.includes(f.type || "") === false
      ); // remove doc cũ
      newList.push(lastFile); // add doc mới
    }

    setListUploadFiles(newList);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between px-4" ref={containerRef}>
      <div className="flex items-center gap-3 relative">
        <Button
          type="text"
          shape="default"
          className={clsx(
            "text-gray-500 w-8 h-8 p-0",
            showEmojiPicker ? "bg-blue-100 text-blue-600" : "text-gray-500"
          )}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          {EmojiIcon}
        </Button>
        <Upload
          accept="image/jpeg, image/png, image/jpg, video/*"
          beforeUpload={beforeUploadImagesAndVideo}
          multiple
          onChange={handleChange}
          showUploadList={false}
          fileList={listUploadFiles}
        >
          <Button
            type="text"
            shape="default"
            className="text-gray-500 w-8 h-8 p-0 text-gray-500"
          >
            <Icon icon="image-02-o" size={22} />
          </Button>
        </Upload>
        <Upload
          accept=".doc,.docx,.pdf"
          beforeUpload={beforeUploadFile}
          onChange={handleChange}
          showUploadList={false}
          fileList={listUploadFiles}
        >
          <Button
            type="text"
            shape="default"
            className="text-gray-500 w-8 h-8 p-0 text-gray-500"
          >
            <Icon icon="link-o" size={22} />
          </Button>
        </Upload>

        {showEmojiPicker && (
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}
      </div>

      <Button
        type="text"
        shape="default"
        className="text-gray-500 w-8 h-8 p-0"
        onClick={handleSend}
      >
        <Icon icon="send-b" size={28} className="text-blue-500" />
      </Button>
    </div>
  );
};

export default ActionBar;
