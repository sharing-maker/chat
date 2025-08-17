"use client";

import { useState } from "react";
import { Icon } from "@droppii-org/chat-sdk";
import { Button } from "@web/components/common/Button";
import { Input } from "@web/components/common/Input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });

  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      return `${name === "username" ? "Tài khoản" : "Mật khẩu"} là bắt buộc`;
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const usernameError = validateField("username", username);
    const passwordError = validateField("password", password);

    setErrors({
      username: usernameError,
      password: passwordError,
    });

    // Sẽ check thêm điều kiện khi integrate với backend
    if (!usernameError && !passwordError) {
      window.location.href = "/chat";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-lg"
    >
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Đăng nhập Quản lý Chat
      </h1>
      <Input
        leftIcon={<Icon icon="user-b" className="text-blue-600" />}
        label="Tài khoản"
        placeholder="Nhập tài khoản"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
      />
      <Input
        leftIcon={<Icon icon="lock-b" className="text-blue-600" />}
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Button type="submit" className="w-full mt-6">
        Đăng nhập
      </Button>
    </form>
  );
}
