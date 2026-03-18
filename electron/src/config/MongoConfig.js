import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sobe de electron/src/config -> raiz do projeto
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

class MongoConfig {
  constructor() {
    this.uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  }
}

export default new MongoConfig();
