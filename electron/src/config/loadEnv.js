import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidatePaths = [
  path.resolve(__dirname, "../../../.env"),
  path.join(process.cwd(), ".env"),
  process.resourcesPath ? path.join(process.resourcesPath, ".env") : null,
  process.resourcesPath ? path.join(process.resourcesPath, "..", ".env") : null,
  path.join(path.dirname(process.execPath), ".env"),
].filter((candidatePath) => typeof candidatePath === "string");

const loadedPaths = new Set();

const loadEnv = () => {
  for (const envPath of candidatePaths) {
    if (loadedPaths.has(envPath)) {
      return envPath;
    }

    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      loadedPaths.add(envPath);
      return envPath;
    }
  }

  return null;
};

export default loadEnv;
