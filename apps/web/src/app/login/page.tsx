"use client";

import { Icon } from "@droppii-org/chat-sdk";
import { AntdButton, AntdInputForm, useAntdToast } from "@droppii-org/ui";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleLogin, useFetchToken } from "@web/hook/user/useLogin";
import useUserStore from "@web/hook/user/useUserStore";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Tài khoản là bắt buộc")
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Tài khoản vui lòng viết liền không dấu, không chứa kí tự đặc biệt"
    ),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate } = useFetchToken();
  const setToken = useUserStore((state) => state.setAccessToken);
  const toast = useAntdToast();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const formInstance = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = formInstance;

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginFormData) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      mutate(
        {
          username: data.username,
          password: data.password,
        },
        {
          onSuccess: (data) => {
            handleLogin({
              data,
              setToken,
              toast,
              router,
            });
          },
          onError: (error) => {
            console.error("Login error:", error);
          },
        }
      );
    }, 400);
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
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          prefix={<Icon icon="lock-b" className="text-blue-600 text-2xl" />}
          className="h-14 text-lg"
          suffix={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className="focus:outline-none"
            >
              <Icon
                icon={showPassword ? "eye-off-b" : "eye-b"}
                className="text-gray-400 text-xl"
              />
            </button>
          }
        />

        <AntdButton
          htmlType="submit"
          type="primary"
          disabled={isSubmitting || !isValid}
          className="w-full mt-8 h-14 text-lg font-semibold rounded-xl"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </AntdButton>
      </form>
    </FormProvider>
  );
}
