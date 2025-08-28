"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  KEY_ENTER_COMMAND,
  COMMAND_PRIORITY_NORMAL,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createLineBreakNode,
  $getRoot,
} from "lexical";
import { useEffect, useRef } from "react";
import { $generateHtmlFromNodes } from "@lexical/html";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $isQuoteNode } from "@lexical/rich-text";

interface EnterHandlerProps {
  onSend: ({
    plainText,
    richText,
  }: {
    plainText: string;
    richText: string;
  }) => void; // gọi khi Enter (submit)
}

export default function EnterHandler({ onSend }: EnterHandlerProps) {
  const [editor] = useLexicalComposerContext();
  const shiftEnterCount = useRef(0);

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent) => {
        // Case 1: Enter (submit, chặn xuống dòng)
        if (!event.shiftKey) {
          event.preventDefault();
          shiftEnterCount.current = 0;

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
              const listType = isListNode
                ? topLevelNode.getListType()
                : undefined;

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

          return true;
        }

        // Case 2: Shift+Enter
        if (event.shiftKey) {
          event.preventDefault();
          shiftEnterCount.current += 1;

          if (shiftEnterCount.current >= 2) {
            // Tách block mới
            shiftEnterCount.current = 0;
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const paragraph = $createParagraphNode();
                selection.insertNodes([paragraph]);
                paragraph.select(); // con trỏ nhảy vào block mới
              }
            });
          } else {
            // Xuống dòng trong block
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.insertNodes([$createLineBreakNode()]);
              }
            });
          }

          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor, onSend]);

  return null;
}
