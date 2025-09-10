import axios from "axios";
import useAuthStore from "../store/auth";

const TIMEOUT = 90000;

export const apiInstance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: TIMEOUT,
});

apiInstance.interceptors.request.use(
  (config: any) => {
    return {
      ...config,
      baseURL: useAuthStore.getState().apiAddress,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        token: useAuthStore.getState().chatToken,
      },
    };
  },
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);
