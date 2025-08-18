import { getSDK } from "@openim/wasm-client-sdk";

export const DChatSDK: ReturnType<typeof getSDK> = getSDK({
  coreWasmPath:
    "https://pub-b11e10131a914403b2a326ec38f7e99f.r2.dev/openIM.wasm",
  sqlWasmPath: "/sql-wasm.wasm",
});
