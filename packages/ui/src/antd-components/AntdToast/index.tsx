import React, { ReactNode, useMemo } from "react";
import { notification } from "antd";
import type { NotificationArgsProps } from "antd";

export type NotificationPlacement = NotificationArgsProps["placement"];

export interface AntdToastOptions {
  title: string;
  description?: string | ReactNode;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  position?: NotificationPlacement;
  isClosable?: boolean;
  isIconVisible?: boolean;
}

const AntdToastContext = React.createContext<{
  show: (options: AntdToastOptions) => void;
}>({ show: () => {} });

export const AntdToastProvider: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const show = (options: AntdToastOptions) => {
    const {
      title,
      description,
      type = "error",
      duration = 3,
      position = "topRight",
      isClosable = true,
      isIconVisible = true,
    } = options;
    api[type]({
      message: title,
      description,
      duration,
      placement: position,
      closable: isClosable,
      icon: isIconVisible ? undefined : <span style={{ display: "none" }} />,
      style: {
        borderRadius: 12,
        fontSize: "1rem",
        padding: "1rem 1.5rem",
      },
    });
  };

  const contextValue = useMemo(() => ({ show }), []);

  return (
    <AntdToastContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </AntdToastContext.Provider>
  );
};

export function useAntdToast() {
  return React.useContext(AntdToastContext);
}
