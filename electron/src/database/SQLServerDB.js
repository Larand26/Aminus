import sql from "mssql";
import SQLServerConfig from "../config/SQLServerConfig.js";

class SQLServerDB {
  static pool = sql.connect({
    server: SQLServerConfig.host,
    port: SQLServerConfig.port,
    user: SQLServerConfig.user,
    password: SQLServerConfig.password,
    database: SQLServerConfig.database,
    options: SQLServerConfig.options,
  });

  static async query(queryString, params = []) {
    const pool = await this.pool;
    const request = pool.request();
    params.forEach((value, index) => request.input(`p${index}`, value));
    const result = await request.query(queryString);
    return result.recordset;
  }

  static async closePool() {
    const pool = await this.pool;
    await pool.close();
  }
}

export default SQLServerDB;
