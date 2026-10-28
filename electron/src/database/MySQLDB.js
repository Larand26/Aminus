import mysql from "mysql2/promise";
import MySQLConfig from "../config/MySQLConfig.js";

const createPool = (database) =>
  mysql.createPool({
    host: MySQLConfig.host,
    port: MySQLConfig.port,
    user: MySQLConfig.user,
    password: MySQLConfig.password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

class MySQLDB {
  static pool = createPool(MySQLConfig.database);

  // Banco `catalog`: produtos, fabricantes, cores e fotos.
  static catalogPool = createPool(MySQLConfig.catalogDatabase);

  static async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  static async catalogQuery(sql, params = []) {
    const [rows] = await this.catalogPool.query(sql, params);
    return rows;
  }

  /**
   * Executa `callback` dentro de uma transação no banco `catalog`.
   * @template T
   * @param {(query: (sql: string, params?: Array<unknown>) => Promise<any>) => Promise<T>} callback
   * @returns {Promise<T>}
   */
  static async catalogTransaction(callback) {
    const connection = await this.catalogPool.getConnection();
    try {
      await connection.beginTransaction();
      const query = async (sql, params = []) => {
        const [rows] = await connection.query(sql, params);
        return rows;
      };
      const result = await callback(query);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async closePool() {
    await Promise.all([this.pool.end(), this.catalogPool.end()]);
  }
}

export default MySQLDB;
