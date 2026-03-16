import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sobe de electron/src/config -> raiz do projeto
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

class SQLServerConfig {
  constructor() {
    this.host = process.env.DB_HOST || "localhost";
    this.port = Number(process.env.DB_PORT || 1433);
    this.user = process.env.DB_USER;
    this.password = process.env.DB_PASSWORD;
    this.database = process.env.DB_DATABASE;
    this.options = {
      encrypt: false,
      trustServerCertificate: true,
    };
  }
}

export default new SQLServerConfig();
