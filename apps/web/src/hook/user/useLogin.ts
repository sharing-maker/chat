import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { apiInstance } from "@web/services/api";
import { ENDPOINTS, ROUTES } from "@web/services/routes";
import { BaseResponse } from "@web/types/common";
import { jwtDecode } from "jwt-decode";

interface useFetchTokenProps {
  username: string;
  password: string;
}

export const useFetchToken = (): UseMutationResult<
  BaseResponse<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>,
  unknown,
  useFetchTokenProps
> =>
  useMutation({
    mutationFn: async (data: useFetchTokenProps) => {
      const res = await apiInstance.post<any>(
        ENDPOINTS.identityService.getToken,
        {
          username: data.username,
          password: data.password,
        }
      );

      return res.data;
    },
  });

export async function handleLogin({
  data,
  setToken,
  toast,
  router,
}: {
  data: any;
  setToken: (token: string) => void;
  toast: any;
  router: any;
}) {
  if (data?.statusCode !== 0) {
    toast.show({
      title: "Đăng nhập thất bại",
      description:
        data?.message || "Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.",
      type: "error",
      duration: 3,
      position: "topRight",
      isClosable: false,
    });
    return false;
  }
  const token = data?.data?.accessToken || "";
  const jwtParser = jwtDecode(token) as any;
  if (jwtParser?.role?.includes("CRM_LIVE_CHAT")) {
    setToken(token);
    if (token) {
      window.localStorage.setItem("user_token", token);
    }
    toast.show({
      title: "Đăng nhập thành công",
      type: "success",
      position: "topRight",
      isClosable: false,
    });

    window.location.href = ROUTES.CHAT;

    return true;
  } else {
    toast.show({
      title: "Đăng nhập thất bại",
      description:
        "Tài khoản không có quyền truy cập. Vui lòng liên hệ Droppii.",
      type: "error",
      duration: 3,
      position: "topRight",
      isClosable: false,
    });
    return false;
  }
}
