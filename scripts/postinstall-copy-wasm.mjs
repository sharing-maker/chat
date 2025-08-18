import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import { fileURLToPath } from "url";

// --- Configuration ---
// The package inside your local `packages/chat-sdk` that contains the assets.
const WASM_PACKAGE_NAME = "@openim/wasm-client-sdk";
// The folder inside that package containing the files to copy.
const ASSETS_SUBFOLDER = "assets";
// --- End Configuration ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root (assuming this script is in `scripts/` at the root)
const projectRoot = path.resolve(__dirname, "..");

console.log("Starting postinstall script to copy WASM assets...");

async function run() {
  try {
    // Define the source directory for the WASM assets
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
      console.error(`\n\n--- ERROR ---`);
      console.error(`Source directory not found: ${sourceDir}`);
      console.error(
        `Please ensure 'pnpm install' has been run within the 'packages/chat-sdk' workspace or at the root.`
      );
      console.error(`-------------\n\n`);
      process.exit(1);
    }

    // Ensure the public directory exists
    await fs.ensureDir(assetsDir);

    // Copy the assets
    await fs.copy(sourceDir, assetsDir, {
      overwrite: true,
      errorOnExist: false,
    });

    console.log(`  -> Successfully copied assets to ${assetsDir}`);
  } catch (error) {
    console.error("An error occurred during the postinstall script:", error);
    process.exit(1);
  }
}

run();
