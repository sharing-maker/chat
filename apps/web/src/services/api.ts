import axios from "axios";

const TIMEOUT = 90000;
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiInstance = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: TIMEOUT,
});
