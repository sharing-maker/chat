"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ToolbarPlugin } from "./ToolbarPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkNode } from "@lexical/link";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { useCallback } from "react";
import EnterHandler from "./EnterHandler";
import ActionBar from "./ActionBar";

interface IMessageFooterProps {
  sendTextMessage: ({
    plainText,
    richText,
  }: {
    plainText: string;
    richText: string;
  }) => void;
}

const theme = {
  text: {
    bold: "font-bold",
    italic: "italic",
    strikethrough: "line-through",
    underline: "underline",
  },
  quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600",
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal list-inside",
    ul: "list-disc list-inside",
  },
  link: "text-blue-500 underline hover:text-blue-700",
};

const onError = (error: Error) => {
  console.error(error);
};

const initialConfig = {
  namespace: "ChatInput",
  theme,
  onError,
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode],
};

const MessageFooter = (props: IMessageFooterProps) => {
  const { sendTextMessage } = props;

  const handleSendTextMessage = useCallback(
    ({ plainText, richText }: { plainText: string; richText: string }) => {
      sendTextMessage({ plainText, richText });
    },
    [sendTextMessage]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border-t px-4 py-2 flex flex-col gap-2">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="border border-indigo-500 rounded-md bg-blue-100 min-h-[64px] max-h-[140px] overflow-y-auto px-3 py-2 text-sm" />
            }
            ErrorBoundary={LexicalErrorBoundary}
            aria-placeholder="Nhập tin nhắn"
            placeholder={
              <div className="absolute top-2 left-3 pointer-events-none">
                <p className="text-gray-500 text-sm">Nhập tin nhắn</p>
              </div>
            }
          />
        </div>
        <ActionBar onSend={handleSendTextMessage} />
      </div>
      <LinkPlugin />
      <ListPlugin />
      <EnterHandler onSend={handleSendTextMessage} />
    </LexicalComposer>
  );
};

export default MessageFooter;
