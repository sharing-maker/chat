"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "antd";
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

interface IActionBarProps {
  onSend: ({
    plainText,
    richText,
  }: {
    plainText: string;
    richText: string;
  }) => void;
}

const ActionBar = (props: IActionBarProps) => {
  const { onSend } = props;
  const [editor] = useLexicalComposerContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = useCallback(() => {
    let plainText = "";
    let richText = "";

    // lấy plain text & html
    editor.getEditorState().read(() => {
      plainText = $getRoot().getTextContent();
      richText = $generateHtmlFromNodes(editor);
    });

    if (plainText.trim().length > 0 || richText.trim().length > 0) {
      onSend({ plainText, richText });
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
  }, [editor, onSend]);

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
    <div className="flex items-center justify-between" ref={containerRef}>
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
        <Icon icon="send-b" size={22} className="text-blue-500" />
      </Button>
    </div>
  );
};

export default ActionBar;
