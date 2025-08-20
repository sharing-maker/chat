import React from "react";
import { Button, ButtonProps } from "antd";

export const AntdButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
