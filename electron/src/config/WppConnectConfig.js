import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sobe de electron/src/config -> raiz do projeto
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

class WppConnectConfig {
  constructor() {
    this.apiUrl = process.env.WPP_CONNECT_API_URL || "http://localhost:8000";
  }
  buildHeaders(token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
}
export default new WppConnectConfig();
