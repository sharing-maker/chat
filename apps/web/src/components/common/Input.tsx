"use client";

import React, { InputHTMLAttributes, useId, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import clsx from "clsx";
import { Icon } from "@droppii-org/chat-sdk";

type Size = "sm" | "md" | "lg";
type Variant = "default" | "ghost" | "outline";

export interface CommonInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  description?: string;
  error?: string | null;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  size?: Size;
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
}

export const Input = ({
  label,
  description,
  error,
  leftIcon,
  rightElement,
  size = "md",
  variant = "default",
  fullWidth = true,
  className,
  type = "text",
  value,
  defaultValue,
  ...rest
}: CommonInputProps) => {
  const id = useId();
  const descId = `${id}-desc`;
  const errId = `${id}-err`;
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const base = "flex items-center gap-2 rounded-md transition-shadow";
  const sizeMap: Record<Size, string> = {
    sm: "text-sm px-2 py-1 h-9",
    md: "text-base px-3 py-2 h-11",
    lg: "text-lg px-4 py-3 h-14",
  };

  const variantMap: Record<Variant, string> = {
    default: "bg-white border shadow-sm",
    outline: "bg-white border",
    ghost: "bg-transparent border border-transparent",
  };

  const errorStyles = error
    ? "border-red-500 ring-1 ring-red-200"
    : "border-gray-200 focus-within:ring-2 focus-within:ring-blue-200";

  return (
    <div
      className={clsx(
        "flex flex-col",
        fullWidth ? "w-full" : "inline-block",
        className
      )}
    >
      {label && (
        <LabelPrimitive.Root
          className="mb-1 text-sm font-medium text-gray-700"
          htmlFor={id}
        >
          {label}
        </LabelPrimitive.Root>
      )}

      <div
        className={clsx(
          base,
          sizeMap[size],
          variantMap[variant],
          errorStyles,
          "overflow-hidden",
          {
            "justify-between": !leftIcon && !rightElement,
          }
        )}
      >
        {leftIcon ? <Slot className="flex-shrink-0">{leftIcon}</Slot> : null}

        <input
          id={id}
          type={inputType}
          aria-invalid={!!error}
          aria-describedby={error ? errId : description ? descId : undefined}
          className={clsx(
            "flex-1 bg-transparent outline-none w-full",
            "placeholder:text-gray-400"
          )}
          value={value}
          defaultValue={defaultValue}
          {...rest}
        />

        {rightElement ? (
          <div className="flex items-center gap-2 mr-2">{rightElement}</div>
        ) : null}

        {type === "password" ? (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
            className="flex-shrink-0 px-2 h-full"
          >
            {showPassword ? <Icon icon="eye-o" /> : <Icon icon="eye-off-o" />}
          </button>
        ) : null}
      </div>

      {description && !error && (
        <p id={descId} className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      )}

      {error && (
        <p id={errId} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
