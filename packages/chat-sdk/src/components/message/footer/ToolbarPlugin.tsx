"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $createQuoteNode, $isQuoteNode } from "@lexical/rich-text";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

const quoteIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.24615 10.5714C4.5616 10.5714 3.99078 10.5715 3.53762 10.5105C3.0593 10.4462 2.62745 10.3047 2.28042 9.95769C1.9334 9.61072 1.79194 9.17887 1.72763 8.70055C1.6667 8.24737 1.66673 7.67654 1.66675 6.99199V6.91274C1.66673 6.22819 1.6667 5.65734 1.72763 5.20419C1.79194 4.72586 1.9334 4.29401 2.28043 3.94699C2.62746 3.59997 3.0593 3.4585 3.53762 3.3942C3.99078 3.33327 4.56161 3.33329 5.24615 3.33331H5.32541C6.00995 3.33329 6.5808 3.33327 7.03397 3.3942C7.51228 3.4585 7.94413 3.59997 8.29116 3.94699C8.63817 4.29401 8.77966 4.72586 8.84396 5.20419C8.90491 5.65734 8.90484 6.22817 8.90484 6.91272V6.99198C8.90484 7.67652 8.90491 8.24737 8.84396 8.70055C8.77966 9.17887 8.63817 9.61072 8.29116 9.95769C7.94413 10.3047 7.51228 10.4462 7.03397 10.5105C6.5808 10.5715 6.00998 10.5714 5.32544 10.5714H5.24615Z"
      fill="currentColor"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2.84403 16.1313C2.71884 15.7295 2.94301 15.3023 3.34474 15.1772C5.71249 14.4393 7.38095 12.3426 7.38095 9.914V6.76172C7.38095 6.34094 7.72207 5.99982 8.14286 5.99982C8.56366 5.99982 8.90476 6.34094 8.90476 6.76172V9.914C8.90476 13.0731 6.73976 15.7152 3.79812 16.6319C3.39638 16.7572 2.96923 16.533 2.84403 16.1313Z"
      fill="currentColor"
    ></path>
    <path
      d="M14.389 10.5714C13.7044 10.5714 13.1336 10.5715 12.6804 10.5105C12.2021 10.4462 11.7703 10.3047 11.4233 9.95769C11.0762 9.61072 10.9348 9.17887 10.8704 8.70055C10.8095 8.24737 10.8096 7.67654 10.8096 6.99199V6.91274C10.8096 6.22819 10.8095 5.65734 10.8704 5.20419C10.9348 4.72586 11.0762 4.29401 11.4233 3.94699C11.7703 3.59997 12.2021 3.4585 12.6804 3.3942C13.1336 3.33327 13.7044 3.33329 14.389 3.33331H14.4682C15.1528 3.33329 15.7236 3.33327 16.1768 3.3942C16.6551 3.4585 17.087 3.59997 17.4339 3.94699C17.781 4.29401 17.9225 4.72586 17.9868 5.20419C18.0477 5.65734 18.0477 6.22817 18.0477 6.91272V6.99198C18.0477 7.67652 18.0477 8.24737 17.9868 8.70055C17.9225 9.17887 17.781 9.61072 17.4339 9.95769C17.087 10.3047 16.6551 10.4462 16.1768 10.5105C15.7236 10.5715 15.1528 10.5714 14.4682 10.5714H14.389Z"
      fill="currentColor"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.9869 16.1313C11.8617 15.7295 12.0858 15.3023 12.4876 15.1772C14.8553 14.4393 16.5238 12.3426 16.5238 9.914V6.76172C16.5238 6.34094 16.8649 5.99982 17.2857 5.99982C17.7065 5.99982 18.0476 6.34094 18.0476 6.76172V9.914C18.0476 13.0731 15.8825 15.7152 12.9409 16.6319C12.5392 16.7572 12.112 16.533 11.9869 16.1313Z"
      fill="currentColor"
    ></path>
  </svg>
);

const codeIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.41925 6.07724C6.74925 6.40268 6.74925 6.93031 6.41925 7.25575L3.63676 9.99983L6.41925 12.7439C6.74925 13.0693 6.74925 13.597 6.41925 13.9224C6.08926 14.2479 5.55424 14.2479 5.22424 13.9224L1.96374 10.7069C1.56775 10.3164 1.56775 9.68325 1.96374 9.29272L5.22424 6.07724C5.55424 5.7518 6.08926 5.7518 6.41925 6.07724Z"
      fill="currentColor"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.5809 6.07724C13.2509 6.40268 13.2509 6.93031 13.5809 7.25575L16.3634 9.99983L13.5809 12.7439C13.2509 13.0693 13.2509 13.597 13.5809 13.9224C13.9109 14.2479 14.4459 14.2479 14.7759 13.9224L18.0364 10.7069C18.4324 10.3164 18.4324 9.68325 18.0364 9.29272L14.7759 6.07724C14.4459 5.7518 13.9109 5.7518 13.5809 6.07724Z"
      fill="currentColor"
    ></path>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.8957 3.36522C12.3382 3.49166 12.5945 3.9529 12.468 4.39543L9.13468 16.0621C9.00825 16.5046 8.54701 16.7609 8.10448 16.6344C7.66195 16.508 7.40571 16.0468 7.53214 15.6042L10.8655 3.93756C10.9919 3.49503 11.4532 3.23879 11.8957 3.36522Z"
      fill="currentColor"
    ></path>
  </svg>
);
export const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [activeMarks, setActiveMarks] = useState<string[]>([]);

  const formatTextButtons = useMemo(() => {
    return [
      {
        key: "bold",
        icon: <BoldOutlined size={22} />,
        onPress: () => formatText("bold"),
        isActive: activeMarks.includes("bold"),
      },
      {
        key: "italic",
        icon: <ItalicOutlined size={22} />,
        onPress: () => formatText("italic"),
        isActive: activeMarks.includes("italic"),
      },
      {
        key: "strikethrough",
        icon: <StrikethroughOutlined size={22} />,
        onPress: () => formatText("strikethrough"),
        isActive: activeMarks.includes("strikethrough"),
      },
    ];
  }, [activeMarks]);

  const insertListButtons = useMemo(() => {
    return [
      {
        key: "number",
        icon: <OrderedListOutlined size={22} />,
        onPress: () => insertList("number"),
        isActive: activeMarks.includes("number"),
      },
      {
        key: "bullet",
        icon: <UnorderedListOutlined size={22} />,
        onPress: () => insertList("bullet"),
        isActive: activeMarks.includes("bullet"),
      },
    ];
  }, [activeMarks]);

  const otherButtons = useMemo(() => {
    return [
      {
        key: "link",
        icon: <LinkOutlined size={22} />,
        onPress: () => insertLink(),
        isActive: activeMarks.includes("link"),
      },
      {
        key: "quote",
        icon: quoteIcon,
        onPress: () => insertQuote(),
        isActive: activeMarks.includes("quote"),
      },
    ];
  }, [activeMarks]);

  const formatText = useCallback(
    (format: "bold" | "italic" | "strikethrough") => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [editor]
  );

  const insertList = useCallback(
    (listType: "number" | "bullet") => {
      if (listType === "number") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      }
    },
    [editor]
  );

  const insertQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const topLevelNode = anchorNode.getTopLevelElementOrThrow();

        if ($isQuoteNode(topLevelNode)) {
          // Nếu đang là QuoteNode → chuyển về Paragraph (bình thường)
          const paragraph = $createParagraphNode();
          // copy con của quote sang paragraph
          const children = topLevelNode.getChildren();
          children.forEach((child) => paragraph.append(child));
          topLevelNode.replace(paragraph);
        } else {
          // Nếu chưa có → tạo QuoteNode
          const quote = $createQuoteNode();
          const children = topLevelNode.getChildren();
          children.forEach((child) => quote.append(child));
          topLevelNode.replace(quote);
        }
      }
    });
  }, [editor]);

  const insertLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
  }, [editor]);

  const getButtonClasses = (isActive: boolean) => {
    return `w-8 h-8 p-0 border-sm ${
      isActive
        ? "bg-blue-100 text-blue-600"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    }`;
  };

  useEffect(() => {
    const updateToolbar = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const marks: string[] = [];

          // inline
          if (selection.hasFormat("bold")) marks.push("bold");
          if (selection.hasFormat("italic")) marks.push("italic");
          if (selection.hasFormat("underline")) marks.push("underline");
          if (selection.hasFormat("code")) marks.push("code");

          // block
          const anchorNode = selection.anchor.getNode();
          const topLevelNode = anchorNode.getTopLevelElementOrThrow();

          if ($isQuoteNode(topLevelNode)) {
            marks.push("quote");
          } else if ($isListNode(topLevelNode)) {
            marks.push(
              topLevelNode.getListType() === "number" ? "number" : "bullet"
            );
          } else if (topLevelNode.getType() === "heading") {
            marks.push("heading");
          }

          setActiveMarks(marks);
        } else {
          setActiveMarks([]);
        }
      });
    };

    const removeUpdateListener = editor.registerUpdateListener(() => {
      updateToolbar();
    });

    const removeSelectionListener = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeUpdateListener();
      removeSelectionListener();
    };
  }, [editor]);

  return (
    <div className="flex items-center gap-2 px-4">
      {formatTextButtons.map((button) => {
        const { icon, onPress, key, isActive } = button;
        return (
          <Button
            type="text"
            shape="default"
            className={getButtonClasses(isActive)}
            onClick={onPress}
            key={key}
          >
            {icon}
          </Button>
        );
      })}

      {insertListButtons.map((button) => {
        const { icon, onPress, key, isActive } = button;
        return (
          <Button
            type="text"
            shape="default"
            className={getButtonClasses(isActive)}
            onClick={onPress}
            key={key}
          >
            {icon}
          </Button>
        );
      })}

      {otherButtons.map((button) => {
        const { icon, onPress, key, isActive } = button;
        return (
          <Button
            type="text"
            shape="default"
            className={getButtonClasses(isActive)}
            onClick={onPress}
            key={key}
          >
            {icon}
          </Button>
        );
      })}
    </div>
  );
};
