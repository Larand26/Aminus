import mysql from "mysql2/promise";
import MySQLConfig from "../config/MySQLConfig.js";

class MySQLDB {
  static pool = mysql.createPool({
    host: MySQLConfig.host,
    port: MySQLConfig.port,
    user: MySQLConfig.user,
    password: MySQLConfig.password,
    database: MySQLConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  static async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  static async closePool() {
    await this.pool.end();
  }
}

export default MySQLDB;
