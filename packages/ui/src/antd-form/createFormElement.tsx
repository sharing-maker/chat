import React, { ReactNode } from "react";
import {
  useFormContext,
  UseFormReturn,
  Controller,
  RegisterOptions,
  get,
} from "react-hook-form";
// import FormControl from '@mui/material/FormControl'

import { Typography } from "antd";
import { AntdText } from "../antd-components/AntdText";
import { useId } from "../hooks/useId";

export type FormElement<T> = {
  label?: string | ReactNode;
  id?: string;
  helpText?: React.ReactNode;
  containerClassName?: string;
  name: string;
  isRequired?: boolean;
  labelClassName?: string;
  strongLabel?: boolean;
  fullWidth?: boolean;
  noLabel?: boolean;
} & T;

export type NonNativeOnChange<T> = (
  setValue: UseFormReturn["setValue"],
  field: string
) => (value: T) => void;

const { Text } = Typography;

export function createFormElement<TFromElement, TNonNativeOnChange = any>(
  Component: React.FC<any>,
  nonNativeOnChange?: NonNativeOnChange<TNonNativeOnChange>
) {
  return React.forwardRef<
    HTMLInputElement,
    FormElement<TFromElement> & {
      rules?: Omit<
        RegisterOptions,
        "valueAsNumber" | "valueAsDate" | "setValueAs"
      >;
      labelHelperText?: string;
    }
  >((props, forwardedRef) => {
    const {
      label,
      helpText,
      containerClassName,
      name,
      rules,
      id: propId,
      labelHelperText,
      isRequired,
      labelClassName,
      strongLabel,
      fullWidth = true,
      noLabel,
      ...rest
    } = props;

    const id = useId(propId);
    const {
      formState: { errors },
      setValue,
      control,
      register,
    } = useFormContext();

    const error = get(errors, name);
    const isError = Boolean(error);

    return (
      <div className={`flex flex-col gap-1 w-full ${containerClassName || ""}`}>
        <AntdText
          size="sm"
          strong={strongLabel}
          style={{ height: noLabel ? 0 : 22 }}
          type={error ? "danger" : undefined}
          className={`flex items-center gap-1 ${
            error ? "text-red-500" : "text-gray-700"
          } ${noLabel ? "h-0" : "h-6"}`}
        >
          {isRequired ? <span className="text-red-500">* </span> : null}
          {label}
          {helpText && (
            <span className="ml-1 text-xs text-gray-400">{helpText}</span>
          )}
        </AntdText>
        <Controller
          control={control}
          name={name}
          render={(controllerProps) => (
            <Component
              {...controllerProps.field}
              ref={forwardedRef}
              aria-invalid={isError}
              checked={controllerProps.field.value}
              error={Boolean(errors[name])}
              fullWidth={fullWidth}
              id={id}
              invalid={`${isError}`}
              label={label}
              register={register(name)}
              status={isError ? "error" : undefined}
              onChange={
                nonNativeOnChange
                  ? nonNativeOnChange(setValue, name)
                  : controllerProps.field.onChange
              }
              // README: rest should be end of props
              {...rest}
            />
          )}
          rules={rules}
        />
        {error ? (
          <Text
            className="text-xs mt-2"
            style={{ color: "#ef4444" }}
            type="danger"
          >
            {error?.message}
          </Text>
        ) : null}
      </div>
    );
  });
}

export default createFormElement;
