import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sobe de electron/src/config -> raiz do projeto
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

class FrenetConfig {
  constructor() {
    this.apiKey = process.env.FRENET_API_KEY;
  }
}

export default new FrenetConfig();
