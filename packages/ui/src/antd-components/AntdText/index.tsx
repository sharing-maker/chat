import { Typography } from "antd";
import { TextProps } from "antd/es/typography/Text";

const { Text } = Typography;

const FONT_SIZE = {
  sx: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
} as const;

interface AntdTextProps extends TextProps {
  size?: keyof typeof FONT_SIZE | string | number;
}

export const AntdText = (props: AntdTextProps) => {
  const { size, style, ...rest } = props;

  return (
    <Text
      {...rest}
      style={{
        ...style,
        // @ts-ignore
        fontSize: size ? FONT_SIZE[size] || size : undefined,
        margin: 0,
        display: "block",
      }}
    />
  );
};
