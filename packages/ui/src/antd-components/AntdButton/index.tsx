import React from "react";
import { Button, ButtonProps } from "antd";

const AntdButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};

export default AntdButton;
