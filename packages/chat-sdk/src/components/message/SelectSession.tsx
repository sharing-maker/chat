"use client";

import { Select } from "antd";
import { Icon } from "../icon";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { SelectSessionOption } from "./MessageHeader";

interface SelectSessionProps {
  options: SelectSessionOption[];
  value: SelectSessionOption["value"];
  onChange: (value: SelectSessionOption["value"]) => void;
  excludeOptions?: SelectSessionOption["value"][];
  placeholder?: string;
}

const SelectSession = ({
  options,
  value,
  onChange,
  excludeOptions,
  placeholder,
}: SelectSessionProps) => {
  const { t } = useTranslation();
  const selectedOption = options.find((option) => option.value === value);

  // Filter out excluded options
  const filteredOptions = options.filter(
    (option) => !excludeOptions?.includes(option.value)
  );

  // Transform options for Ant Design Select
  const selectOptions = filteredOptions.map((option) => ({
    label: (
      <div className="flex items-center gap-2">
        <div
          className={clsx(
            "w-2 h-2 rounded-full",
            option.tintColorClassnameBg
          )}
        />
        <span className={clsx("text-xs truncate flex-1", option.tintColorClassname)}>
          {option.label}
        </span>
      </div>
    ),
    value: option.value,
  }));

  // Handle selection change
  const handleSelect = (val: SelectSessionOption["value"]) => {
    onChange(val);
  };

  return (
    <div className="relative">
      <Select
        className={`${selectedOption?.bgTintColorClassname} custom-select min-w-[150px]`}
        placement="bottomLeft"
        placeholder={placeholder}
        options={selectOptions}
        value={selectedOption?.value}
        onChange={handleSelect}
        suffixIcon={<Icon icon='angle-down-o' className={`${selectedOption?.tintColorClassname} mt-[2px]`} size={14} />}
        menuItemSelectedIcon={null}
        labelRender={(option) => (['NONE', ''] as any).includes(option.value) ? placeholder : option.label }
        
      />
    </div>
  );
};

export default SelectSession;
