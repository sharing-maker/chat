"use client";

import { Icon } from "@droppii-org/chat-sdk";
import { useState } from "react";

interface MessageSubCategory {
  icon: string;
  label: string;
  count: number;
  color: string;
}

interface MessageCategory {
  icon: string;
  label: string;
  count: number;
  color: string;
  subCategories?: MessageSubCategory[];
}

const messageCategories: MessageCategory[] = [
  {
    icon: "chat-square-b",
    label: "Đang mở",
    count: 43,
    color: "text-gray-600",
    subCategories: [
      {
        icon: "user-del-o",
        label: "Chưa phân công",
        count: 1,
        color: "text-orange-500",
      },
      {
        icon: "warning-square-o",
        label: "Chậm xử lý",
        count: 1,
        color: "text-red-500",
      },
      {
        icon: "time-circle-o",
        label: "Chờ xử lý",
        count: 0,
        color: "text-orange-400",
      },
      {
        icon: "arrow-reply-o",
        label: "Chưa trả lời",
        count: 1,
        color: "text-purple-500",
      },
      {
        icon: "play-b",
        label: "Đang xử lý",
        count: 38,
        color: "text-gray-600",
      },
      {
        icon: "pause-b",
        label: "Tạm chờ",
        count: 2,
        color: "text-gray-600",
      },
    ],
  },
  {
    icon: "check-b",
    label: "Đã đóng",
    count: 0,
    color: "text-green-600",
  },
];

export default function ChatPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set([0])
  );

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="flex h-screen relative">
      {/* Message Categories Panel */}
      <div
        className="w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out"
        style={{ marginLeft: "256px" }} // Offset by sidebar width
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            TIN NHẮN CỦA TÔI
          </h2>
        </div>

        {/* Categories List */}
        <div className="w-64 overflow-y-auto">
          <ul className="py-2">
            {messageCategories.map((category, index) => (
              <li key={index}>
                {/* Main Category */}
                <button
                  onClick={() =>
                    category.subCategories && toggleCategory(index)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {category.subCategories && (
                        <Icon
                          icon={
                            expandedCategories.has(index)
                              ? "chevron-down-b"
                              : "chevron-right-b"
                          }
                          size={14}
                          className="text-gray-400"
                        />
                      )}
                      <Icon
                        icon={category.icon}
                        size={20}
                        className={category.color}
                      />
                    </div>
                    <span className="font-medium text-gray-800 text-left">
                      {category.label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500 min-w-0">
                    {category.count}
                  </span>
                </button>

                {/* Sub Categories */}
                {category.subCategories && expandedCategories.has(index) && (
                  <ul className="ml-4 border-l border-gray-200">
                    {category.subCategories.map((subCategory, subIndex) => (
                      <li key={subIndex}>
                        <button className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 ml-4">
                              <Icon
                                icon={subCategory.icon}
                                size={18}
                                className={subCategory.color}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700 text-left">
                              {subCategory.label}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-500 min-w-0">
                            {subCategory.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-50 w-full p-6 transition-all duration-300">
        <h1 className="text-3xl font-bold mb-6">Chat Management</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">
            Chọn một danh mục tin nhắn từ bên trái để xem chi tiết.
          </p>
        </div>
      </div>
    </div>
  );
}
