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
        className="flex flex-col gap-6 w-full h-full bg-white rounded-2xl shadow-xl p-16 py-16 border border-gray-200 justify-center"
        style={{ minHeight: "600px" }}
      >
        <h1 className="text-3xl font-bold mb-10 text-center text-gray-900">
          Đăng nhập Quản lý Chat
        </h1>

        <AntdInputForm
          name="username"
          label="Tài khoản"
          isRequired={true}
          placeholder="Nhập tài khoản"
          prefix={<Icon icon="user-b" className="text-blue-600 text-2xl" />}
          className="h-14 text-lg"
        />

        <AntdInputForm
          name="password"
          label="Mật khẩu"
          isRequired={true}
          type="password"
          placeholder="Nhập mật khẩu"
          prefix={<Icon icon="lock-b" className="text-blue-600 text-2xl" />}
          className="h-14 text-lg"
        />

        <AntdButton
          htmlType="submit"
          type="primary"
          disabled={isSubmitting}
          className="w-full mt-8 h-14 text-lg font-semibold rounded-xl"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </AntdButton>
      </form>
    </FormProvider>
  );
}
