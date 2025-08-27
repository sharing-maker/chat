"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import FooterBottomSection from "./BottomSection";

const theme = {
  // Theme styling goes here
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
const onError = (error: Error) => {
  console.error(error);
};

const initialConfig = {
  namespace: "ChatInput",
  theme,
  onError,
};

const MessageFooter = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border-t px-4 py-3">
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="border border-indigo-500 rounded-md bg-blue-100 min-h-[64px] px-3 py-2 text-sm" />
            }
            ErrorBoundary={LexicalErrorBoundary}
            aria-placeholder="Nhập tin nhắn"
            placeholder={
              <div className="absolute top-2 left-3">
                <p className="text-gray-500 text-sm">Nhập tin nhắn</p>
              </div>
            }
          />
        </div>
        <FooterBottomSection />
      </div>
    </LexicalComposer>
  );
};
export default MessageFooter;
