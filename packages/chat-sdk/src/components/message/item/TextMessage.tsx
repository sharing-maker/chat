"use client";

import { MessageItem } from "@openim/wasm-client-sdk";
import { ExtendMessageInfo } from "../../../types/chat";

interface TextMessageItemProps {
  message: MessageItem;
}
const TextMessageItem = (props: TextMessageItemProps) => {
  const { message } = props;
  let extendMessageInfo: ExtendMessageInfo | null = null;

  try {
    extendMessageInfo = JSON.parse(message?.ex || "{}") as ExtendMessageInfo;
  } catch (error) {
    extendMessageInfo = {} as ExtendMessageInfo;
    console.error("Failed to parse extendMessageInfo", error);
  }

  if (
    Object.keys(extendMessageInfo).length > 0 &&
    extendMessageInfo?.messageInfo
  ) {
    const htmlContent = extendMessageInfo?.messageInfo?.data?.content || "";
    return (
      <div
        className="text-sm sm:text-base break-words whitespace-pre-line flex-1"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }
  return (
    <span className="text-sm sm:text-base whitespace-pre-wrap">
      {message?.textElem?.content || ""}
    </span>
  );
};

export default TextMessageItem;
