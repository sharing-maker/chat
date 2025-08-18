import type React from "react";
// Placeholder for shared UI components
// This will be expanded in the future

export const Button = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
