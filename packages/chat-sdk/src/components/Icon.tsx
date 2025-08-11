import React from "react";
import IcoMoon from "react-icomoon";
import iconSet from "../assets/droppiiFontSelection.json";

export interface IconProps {
  icon: string;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({
  icon,
  size = 24,
  color = "currentColor",
  className = "",
  style = {},
  onClick,
  ...props
}) => {
  return (
    <IcoMoon
      iconSet={iconSet}
      icon={icon}
      size={size}
      color={color}
      className={className}
      style={style}
      onClick={onClick}
      {...props}
    />
  );
};
