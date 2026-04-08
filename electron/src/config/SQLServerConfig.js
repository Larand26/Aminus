import loadEnv from "./loadEnv.js";

loadEnv();

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
