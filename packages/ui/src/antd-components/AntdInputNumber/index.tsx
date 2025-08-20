import { Flex, InputNumber, InputNumberProps } from "antd";
import { ReactNode } from "react";

export interface AntdInputNumberProps extends InputNumberProps {
  isDecimal?: boolean;
  isError?: boolean;
  suffixLabel?: ReactNode;
  prefixLabel?: ReactNode;
}

const DECIMAL_STEP = 0.0000000000000000001;
const PARSE_DEC_REGEX = /,/g;
const PARSE_INT_REGEX = /\D/g;

export const AntdInputNumber = (props: AntdInputNumberProps) => {
  const { isError, suffixLabel, prefixLabel, isDecimal = false } = props;

  return (
    <Flex gap={8}>
      {prefixLabel}
      <InputNumber
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => {
          return `${value}`.replace(
            isDecimal ? PARSE_DEC_REGEX : PARSE_INT_REGEX,
            ""
          );
        }}
        step={isDecimal ? DECIMAL_STEP : undefined}
        status={isError ? "error" : undefined}
        {...props}
      />
      {suffixLabel}
    </Flex>
  );
};
