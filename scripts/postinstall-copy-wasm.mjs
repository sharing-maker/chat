import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import { fileURLToPath } from "url";

const WASM_PACKAGE_NAME = "@openim/wasm-client-sdk";
const ASSETS_SUBFOLDER = "assets";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Tên file muốn exclude (ví dụ)
const EXCLUDE_FILE = "openIM.wasm";

console.log("Starting postinstall script to copy WASM assets...");

async function run() {
  try {
    const sourceDir = path.join(
      projectRoot,
      "packages",
      "chat-sdk",
      "node_modules",
      WASM_PACKAGE_NAME,
      ASSETS_SUBFOLDER
    );
    const assetsDir = path.join(
      projectRoot,
      "packages",
      "chat-sdk",
      "src",
      "assets"
    );

    console.log(`Source assets directory: ${sourceDir}`);

    if (!fs.existsSync(sourceDir)) {
      console.error(`Source directory not found: ${sourceDir}`);
      process.exit(1);
    }

    await fs.ensureDir(assetsDir);

    // Lấy tất cả file trong source, exclude file cụ thể
    const files = await glob(`${sourceDir}/**/*`, { nodir: true });

    for (const file of files) {
      if (path.basename(file) === EXCLUDE_FILE) continue; // skip file exclude

      // Lấy đường dẫn tương đối so với source
      const relativePath = path.relative(sourceDir, file);
      const destPath = path.join(assetsDir, relativePath);

      await fs.ensureDir(path.dirname(destPath));
      await fs.copyFile(file, destPath);
    }

    console.log(
      `  -> Successfully copied assets to ${assetsDir} (excluded ${EXCLUDE_FILE})`
    );
  } catch (error) {
    console.error("An error occurred during the postinstall script:", error);
    process.exit(1);
  }
}

run();
