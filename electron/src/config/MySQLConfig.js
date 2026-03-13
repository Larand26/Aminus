import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sobe de electron/src/config -> raiz do projeto
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

class MySQLConfig {
  constructor() {
    this.host = process.env.MYSQL_HOST || "localhost";
    this.port = Number(process.env.MYSQL_PORT || 3306);
    this.user = process.env.MYSQL_USER;
    this.password = process.env.MYSQL_PASSWORD;
    this.database = process.env.MYSQL_DATABASE;
  }
}

export default new MySQLConfig();
