"use client";

import { Modal } from "antd";
import { SelectSessionOption } from "./MessageHeader";
import { useBoolean } from "ahooks";
import { Icon } from "../icon";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface SelectSessionProps {
  options: SelectSessionOption[];
  value: SelectSessionOption["value"];
  onChange: (value: SelectSessionOption["value"]) => void;
}

const SelectSession = ({ options, value, onChange }: SelectSessionProps) => {
  const { t } = useTranslation();
  const [open, { toggle }] = useBoolean(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (value: SelectSessionOption["value"]) => {
    onChange(value);
    toggle();
  };

  return (
    <>
      <div
        className={clsx(
          "flex items-center gap-2 px-3 py-1 rounded-sm min-w-[64px] cursor-pointer",
          selectedOption?.bgTintColorClassname,
          selectedOption?.tintColorClassname
        )}
        onClick={toggle}
      >
        <span className="text-xs font-medium truncate">
          {selectedOption?.label || ""}
        </span>
        <Icon icon="angle-down-o" size={14} />
      </div>
      <Modal
        title={t("update_session_status_title")}
        closable={{ "aria-label": "Custom Close Button" }}
        open={open}
        onOk={toggle}
        onCancel={toggle}
        width={300}
        styles={{ content: { padding: 12 } }}
        footer={null}
      >
        <div className="flex flex-col gap-1">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-sm"
                onClick={() => onChange(option.value)}
                key={option.value}
                onClickCapture={() => handleSelect(option.value)}
              >
                <div
                  className={clsx(
                    "w-2 h-2 rounded-full",
                    option.tintColorClassnameBg
                  )}
                />
                <span
                  className={clsx(
                    "text-xs truncate flex-1",
                    isSelected && "font-bold"
                  )}
                >
                  {option.label}
                </span>
                {isSelected && (
                  <Icon icon="check-b" size={18} className="text-blue-500" />
                )}
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default SelectSession;
