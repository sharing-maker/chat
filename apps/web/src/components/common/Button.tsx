"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

export interface CommonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean; // Radix Slot
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, CommonButtonProps>(
  (
    {
      asChild = false,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants: Record<Variant, string> = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400",
      ghost:
        "bg-transparent hover:bg-gray-100 text-gray-900 focus-visible:ring-gray-200",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    };

    const sizes: Record<Size, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <Comp
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";
