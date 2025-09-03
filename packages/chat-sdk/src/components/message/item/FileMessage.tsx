import { MessageItem } from "@openim/wasm-client-sdk";
import { documentIcon, shortenFileName } from "../footer/FilePreview";

interface ImageMessageItemProps {
  message: MessageItem;
}

const FileMessageItem = (props: ImageMessageItemProps) => {
  const { message } = props;

  const handleDownload = () => {
    const url = message.fileElem?.sourceUrl || "";
    const fileName = message.fileElem?.fileName || "";
    if (!url) {
      console.warn("Không có link file để tải");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    if (fileName) {
      link.setAttribute("download", fileName);
    }
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div
      className="relative flex flex-row items-center gap-2 align-center bg-gray-100 rounded-md p-1 pr-2 cursor-pointer"
      onClick={handleDownload}
    >
      {documentIcon}
      <span className="text-xs text-gray-500">
        {shortenFileName(message.fileElem?.fileName || "")}
      </span>
    </div>
  );
};

export default FileMessageItem;
