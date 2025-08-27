import { jwtDecode } from "jwt-decode";

export function handleLogin({
  data,
  setToken,
  toast,
}: {
  data: any;
  setToken: (token: string) => void;
  toast: any;
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
    window.location.href = "/chat";
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
