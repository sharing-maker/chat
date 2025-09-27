"use client";

import { Popover } from "antd";
import { SelectSessionOption } from "./MessageHeader";
import { useBoolean } from "ahooks";
import { Icon } from "../icon";
import clsx from "clsx";

interface SelectSessionProps {
  options: SelectSessionOption[];
  value: SelectSessionOption["value"];
  onChange: (value: SelectSessionOption["value"]) => void;
}

const SelectSession = ({ options, value, onChange }: SelectSessionProps) => {
  const [open, { toggle }] = useBoolean(false);
  const selectedOption = options.find((option) => option.value === value);
  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={toggle}
      content={
        <div className="flex flex-col gap-2 py-2">
          {options.map((option) => (
            <div
              className="flex items-center gap-2 px-3 py-1 cursor-pointer"
              onClick={() => onChange(option.value)}
            >
              <div
                className={clsx(
                  "w-2 h-2 rounded-full",
                  `bg-${option.tintColorClassname}`
                )}
              />
              <span className="text-xs font-medium truncate">
                {option.label}
              </span>
            </div>
          ))}
        </div>
      }
      styles={{ body: { padding: 0 } }}
      arrow={false}
    >
      <div
        className={clsx(
          "flex items-center gap-2 px-3 py-1 rounded-sm min-w-[64px] cursor-pointer",
          `bg-${selectedOption?.bgTintColorClassname}`,
          `text-${selectedOption?.tintColorClassname}`
        )}
      >
        <span className="text-xs font-medium truncate">
          {selectedOption?.label || ""}
        </span>
        <Icon icon="angle-down-o" size={14} />
      </div>
    </Popover>
  );
};

export default SelectSession;
