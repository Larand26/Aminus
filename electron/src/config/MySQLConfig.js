import loadEnv from "./loadEnv.js";

loadEnv();

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
