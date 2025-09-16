import { MessageType } from "@openim/wasm-client-sdk";

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

export const parseLatestMessage = (
  latestMsg: string,
  currentUserId?: string
) => {
  if (!latestMsg) return "";

  try {
    const msgData = JSON.parse(latestMsg);
    const contentType = msgData?.contentType;
    const isMe = currentUserId && msgData.sendID === currentUserId;
    const sender = isMe ? "Me" : msgData?.senderNickname || msgData.sendID;

    switch (contentType) {
      case MessageType.TextMessage:
        if (msgData.textElem?.content) {
          return `${sender}: ${msgData.textElem.content}`;
        }
        break;
      case MessageType.PictureMessage:
        return `${sender}: [Hình ảnh]`;
      case MessageType.VoiceMessage:
        return `${sender}: [Tin nhắn thoại]`;
      case MessageType.VideoMessage:
        return `${sender}: [Video]`;
      case MessageType.FileMessage:
        return `${sender}: [File đính kèm]`;
      default:
        return "Tin nhắn không khả dụng";
    }
    return "Tin nhắn không khả dụng";
  } catch (error) {
    console.error("Error parsing latest message:", error);
    return "";
  }
};

export const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    // Today - show time
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (diffInDays === 1) {
    // Yesterday
    return "Hôm qua";
  } else if (diffInDays < 7) {
    // This week - show day name
    return date.toLocaleDateString("vi-VN", { weekday: "long" });
  } else {
    // Older - show date
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
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
