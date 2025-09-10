"use client";

import { useMemo, useState } from "react";
import { Icon } from "../icon";
import useConversationStore from "../../store/conversation";
import { SESSION_STATUS_ENUM, TAG_ENUM } from "../../constants";
import { SessionStatus, Tag } from "../../store/type";

interface MessageSubCategory {
  icon: string;
  label: string;
  key: string;
  count: number;
  color: string;
  query: { status?: SessionStatus; tag?: Tag };
}

interface MessageCategory {
  icon: string;
  label: string;
  count: number;
  color: string;
  key: string;
  query: { status?: SessionStatus; tag?: Tag };
  subCategories?: MessageSubCategory[];
}

interface AssignedSessionFilterProps {
  onFilterChange?: (categoryId: string, subCategoryId?: string) => void;
  className?: string;
}

const AssignedSessionFilter = ({
  onFilterChange,
  className = "",
}: AssignedSessionFilterProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set([0])
  );
  const [selectedFilter, setSelectedFilter] = useState<string>(
    SESSION_STATUS_ENUM.UNASSIGNED
  );

  const summary = useConversationStore((state) => state.summary);
  const setFilterSummary = useConversationStore(
    (state) => state.setFilterSummary
  );

  const messageCategories: MessageCategory[] = useMemo(() => {
    return [
      {
        icon: "chat-square-b",
        label: "Đang mở",
        key: "ALL",
        count: summary?.activeSessionCount || 0,
        color: "text-gray-600",
        query: {
          status: undefined,
          tag: undefined,
        },
        subCategories: [
          {
            icon: "user-del-o",
            label: "Chưa phân công",
            key: SESSION_STATUS_ENUM.UNASSIGNED,
            count:
              summary?.sessionStatuses?.find(
                (status) => status.type === SESSION_STATUS_ENUM.UNASSIGNED
              )?.count || 0,
            color: "text-orange-500",
            query: {
              status: SESSION_STATUS_ENUM.UNASSIGNED,
              tag: undefined,
            },
          },
          {
            icon: "warning-square-o",
            label: "Chậm xử lý",
            key: TAG_ENUM.SLOW_PROCESSING,
            count:
              summary?.tagCounts?.find(
                (status) => status.type === TAG_ENUM.SLOW_PROCESSING
              )?.count || 0,
            color: "text-red-500",
            query: {
              status: undefined,
              tag: TAG_ENUM.SLOW_PROCESSING,
            },
          },
          {
            icon: "time-circle-o",
            label: "Chờ xử lý",
            key: SESSION_STATUS_ENUM.WAITING_PROCESS,
            count:
              summary?.sessionStatuses?.find(
                (status) => status.type === SESSION_STATUS_ENUM.WAITING_PROCESS
              )?.count || 0,
            color: "text-orange-400",
            query: {
              status: SESSION_STATUS_ENUM.WAITING_PROCESS,
              tag: undefined,
            },
          },
          {
            icon: "arrow-reply-o",
            label: "Chưa trả lời",
            key: TAG_ENUM.AWAITING_REPLY,
            count:
              summary?.tagCounts?.find(
                (status) => status.type === TAG_ENUM.AWAITING_REPLY
              )?.count || 0,
            color: "text-purple-500",
            query: {
              status: undefined,
              tag: TAG_ENUM.AWAITING_REPLY,
            },
          },
          {
            icon: "play-b",
            label: "Đang xử lý",
            key: SESSION_STATUS_ENUM.IN_PROCESS,
            count:
              summary?.sessionStatuses?.find(
                (status) => status.type === SESSION_STATUS_ENUM.IN_PROCESS
              )?.count || 0,
            color: "text-gray-600",
            query: {
              status: SESSION_STATUS_ENUM.IN_PROCESS,
              tag: undefined,
            },
          },
          {
            icon: "pause-b",
            label: "Tạm chờ",
            key: TAG_ENUM.TEMPORARILY_PAUSED,
            count:
              summary?.sessionStatuses?.find(
                (status) => status.type === TAG_ENUM.TEMPORARILY_PAUSED
              )?.count || 0,
            color: "text-gray-600",
            query: {
              status: undefined,
              tag: TAG_ENUM.TEMPORARILY_PAUSED,
            },
          },
        ],
      },
      {
        icon: "check-b",
        label: "Đã đóng",
        key: SESSION_STATUS_ENUM.COMPLETED,
        count:
          summary?.sessionStatuses?.find(
            (status) => status.type === SESSION_STATUS_ENUM.COMPLETED
          )?.count || 0,
        color: "text-green-600",
        query: {
          status: SESSION_STATUS_ENUM.COMPLETED,
          tag: undefined,
        },
      },
    ];
  }, []);

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };

  const handleFilterSelect = (categoryKey: string, subCategoryKey?: string) => {
    const filterKey = subCategoryKey || categoryKey;
    setSelectedFilter(filterKey);

    // Find the selected category and subcategory by key
    const category = messageCategories.find((cat) => cat.key === categoryKey);
    let query;
    if (category) {
      if (subCategoryKey && category.subCategories) {
        const subCategory = category.subCategories.find(
          (sub) => sub.key === subCategoryKey
        );
        query = subCategory?.query;
      } else {
        query = category.query;
      }
    }

    if (query) {
      setFilterSummary(query);
    }

    onFilterChange?.(categoryKey, subCategoryKey);
  };

  return (
    <div
      className={`w-64 bg-white border-r border-gray-200 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          TIN NHẮN CỦA TÔI
        </h2>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto">
        <ul className="py-2">
          {messageCategories.map((category, index) => (
            <li key={index}>
              {/* Main Category */}
              <button
                onClick={() => {
                  if (category.subCategories) {
                    toggleCategory(index);
                  } else {
                    handleFilterSelect(category.key);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group ${
                  selectedFilter === category.key && !category.subCategories
                    ? "bg-blue-50 border-r-2 border-blue-500"
                    : ""
                }`}
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
                      <button
                        onClick={() =>
                          handleFilterSelect(category.key, subCategory.key)
                        }
                        className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors group ${
                          selectedFilter === subCategory.key
                            ? "bg-blue-50 border-r-2 border-blue-500"
                            : ""
                        }`}
                      >
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
  );
};

export default AssignedSessionFilter;
