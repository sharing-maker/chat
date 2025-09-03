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
import { createContext, useCallback, useContext, useState } from "react";
import EnterHandler from "./EnterHandler";
import ActionBar from "./ActionBar";
import { MessageFooterContextType } from "../../../types/chat";
import { MessageItem } from "@openim/wasm-client-sdk";
import { useSendMessage } from "../../../hooks/message/useSendMessage";
import { UploadFile } from "antd";
import FilePreview from "./FilePreview";

interface IMessageFooterProviderProps {
  lastMessage?: MessageItem;
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

export const MessageFooterContext = createContext<MessageFooterContextType>({
  onSendMessage: () => {},
  listUploadFiles: [],
  setListUploadFiles: () => {},
});

export const useMessageFooterContext = () => useContext(MessageFooterContext);

const MessageFooterProvider = (props: IMessageFooterProviderProps) => {
  const { lastMessage } = props;
  const { sendTextMessage, sendMergeMessage } = useSendMessage(lastMessage);
  const [listUploadFiles, setListUploadFiles] = useState<UploadFile[]>([]);

  const onSendMessage = useCallback(
    async ({
      plainText,
      richText,
      type,
    }: {
      plainText: string;
      richText: string;
      type: "text" | "file";
    }) => {
      if (type === "text") {
        sendTextMessage({ plainText, richText });
      } else {
        sendMergeMessage({ plainText, richText, files: listUploadFiles });
      }
      setListUploadFiles([]);
    },
    [sendMergeMessage, sendTextMessage, listUploadFiles]
  );

  return (
    <MessageFooterContext.Provider
      value={{ onSendMessage, listUploadFiles, setListUploadFiles }}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <div className="border-t pb-2 flex flex-col gap-1">
          {listUploadFiles.length > 0 && <FilePreview />}
          <ToolbarPlugin />
          <div className="relative px-4">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="border border-indigo-500 rounded-md bg-blue-100 min-h-[64px] max-h-[140px] overflow-y-auto px-3 py-2 text-sm" />
              }
              ErrorBoundary={LexicalErrorBoundary}
              aria-placeholder="Nhập tin nhắn"
              placeholder={
                <div className="absolute top-2 left-7 pointer-events-none">
                  <p className="text-gray-500 text-sm">Nhập tin nhắn</p>
                </div>
              }
            />
          </div>
          <ActionBar />
        </div>
        <LinkPlugin />
        <ListPlugin />
        <EnterHandler />
      </LexicalComposer>
    </MessageFooterContext.Provider>
  );
};

export default MessageFooterProvider;
