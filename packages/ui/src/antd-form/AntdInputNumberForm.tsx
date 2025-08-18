import {
  AntdInputNumber,
  AntdInputNumberProps,
} from "../antd-components/AntdInputNumber";
import createFormElement from "./createFormElement";

export const AntdInputNumberForm =
  createFormElement<AntdInputNumberProps>(AntdInputNumber);
