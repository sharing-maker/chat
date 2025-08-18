import { PasswordProps } from "antd/lib/input";
import { Input } from "antd";
import createFormElement from "./createFormElement";

const { Password } = Input;

export const AntdPasswordForm = createFormElement<PasswordProps>(Password);
