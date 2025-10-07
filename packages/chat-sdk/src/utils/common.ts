import { MessageType } from "@openim/wasm-client-sdk";
import dayjs from "dayjs";

export function renderFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;
  let size = bytes;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(1)} ${units[index]}`;
}

export const generateContentBasedOnMessageType = (
  contentType: MessageType,
  plainText?: string
) => {
  switch (contentType) {
    case MessageType.TextMessage:
      return plainText || "";
    case MessageType.PictureMessage:
      return `[Hình ảnh]`;
    case MessageType.VoiceMessage:
      return `[Tin nhắn thoại]`;
    case MessageType.VideoMessage:
      return `[Video]`;
    case MessageType.FileMessage:
      return `[File đính kèm]`;
    case MessageType.UrlTextMessage:
      return `[Liên kết]`;
    default:
      return "";
  }
};

export const parseLatestMessage = (
  latestMsg: string,
  currentUserId?: string,
  t?: any
) => {
  if (!latestMsg) return "";

  try {
    const msgData = JSON.parse(latestMsg);
    const contentType = msgData?.contentType;
    const isMe = currentUserId && msgData.sendID === currentUserId;
    const sender = isMe ? t("you") : t("customer");

    switch (contentType) {
      case MessageType.TextMessage:
        return `${sender}: ${generateContentBasedOnMessageType(
          contentType,
          msgData?.textElem?.content
        )}`;
      case MessageType.PictureMessage:
        return `${sender}: ${generateContentBasedOnMessageType(contentType)}`;
      case MessageType.VoiceMessage:
        return `${sender}: ${generateContentBasedOnMessageType(contentType)}`;
      case MessageType.VideoMessage:
        return `${sender}: ${generateContentBasedOnMessageType(contentType)}`;
      case MessageType.FileMessage:
        return `${sender}: ${generateContentBasedOnMessageType(contentType)}`;
      case MessageType.UrlTextMessage:
        return `${sender}: ${generateContentBasedOnMessageType(contentType)}`;
      default:
        return "Tin nhắn không khả dụng";
    }
  } catch (error) {
    console.error("Error parsing latest message:", error);
    return "";
  }
};

export const highlightSearch = (
  text: string,
  keyword: string,
  maxLength = 30
) => {
  if (!keyword) return text;

  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const index = lowerText.indexOf(lowerKeyword);

  if (index === -1) {
    return text; // không tìm thấy
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + keyword.length);
  const after = text.slice(index + keyword.length);

  // 🔹 keyword dài hơn maxLength -> chỉ lấy maxLength ký tự trong keyword
  if (keyword.length >= maxLength) {
    return `<mark>${match.slice(0, maxLength)}</mark>`;
  }

  const remain = maxLength - match.length;
  let left = Math.floor(remain / 2);
  let right = remain - left;

  // nếu before không đủ left -> dồn cho after
  if (before.length < left) {
    right += left - before.length;
    left = before.length;
  }

  // nếu after không đủ right -> dồn cho before
  if (after.length < right) {
    left += right - after.length;
    right = after.length;
  }

  const displayedBefore =
    before.length > left ? "…" + before.slice(before.length - left) : before;
  const displayedAfter =
    after.length > right ? after.slice(0, right) + "…" : after;

  return `${displayedBefore}<mark>${match}</mark>${displayedAfter}`;
};

interface FormatOptions {
  hasTime?: boolean;
  dateMonthFormat?: string;
}

export function formatTimestamp(
  timestamp: number,
  options?: FormatOptions
): string {
  const { hasTime = false, dateMonthFormat = "DD/MM" } = options || {};
  const date = dayjs(timestamp);
  const now = dayjs();

  if (date.isSame(now, "day")) {
    // hôm nay
    return hasTime ? date.format("HH:mm") : date.format(dateMonthFormat);
  }

  if (date.isSame(now, "year")) {
    // cùng năm
    return hasTime
      ? date.format(`HH:mm ${dateMonthFormat}`)
      : date.format(dateMonthFormat);
  }

  // khác năm
  return hasTime
    ? date.format(`HH:mm ${dateMonthFormat} YYYY`)
    : date.format(`${dateMonthFormat} YYYY`);
}

export function extractLinks(text: string): string[] {
  // Regex match http:// hoặc https:// và domain
  const urlRegex = /\bhttps?:\/\/[^\s<>"']*[^\s<>"',.!?()\[\]{}]/g;

  return text.match(urlRegex) || [];
}
