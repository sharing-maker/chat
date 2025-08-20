import { getSDK } from "@openim/wasm-client-sdk";
import { coreWasmPath } from "./index";

export const DChatSDK: ReturnType<typeof getSDK> = getSDK({
  coreWasmPath,
  sqlWasmPath: "/sql-wasm.wasm",
  debug: process.env.NODE_ENV === "development",
});
