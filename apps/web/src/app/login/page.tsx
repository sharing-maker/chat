"use client";

import { Icon } from "@droppii-org/chat-sdk";
import { AntdButton, AntdInputForm } from "@droppii-org/ui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Tài khoản là bắt buộc")
    .min(3, "Tài khoản phải có ít nhất 3 ký tự"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const formInstance = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = formInstance;

  const onSubmit = async (data: LoginFormData) => {
    try {
      // TODO: Add your actual login API call here
      // const result = await loginAPI(data);

      // Navigate to chat page after successful login
      window.location.href = "/chat";
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error
    }
  };

  return (
    <FormProvider {...formInstance}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-lg"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Đăng nhập Quản lý Chat
        </h1>

        <AntdInputForm
          name="username"
          label="Tài khoản"
          isRequired={true}
          placeholder="Nhập tài khoản"
          prefix={<Icon icon="user-b" className="text-blue-600" />}
        />

        <AntdInputForm
          name="password"
          label="Mật khẩu"
          isRequired={true}
          type="password"
          placeholder="Nhập mật khẩu"
          prefix={<Icon icon="lock-b" className="text-blue-600" />}
        />

        <AntdButton
          htmlType="submit"
          type="primary"
          disabled={isSubmitting}
          className="w-full mt-4"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </AntdButton>
      </form>
    </FormProvider>
  );
}
