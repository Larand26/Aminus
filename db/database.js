const sql = require("mssql");
require("dotenv").config();
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
} = require("../globals");

const sqlParametros = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_HOST,
  database: DB_DATABASE,
  port: DB_PORT,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  connectionTimeout: 10000,
};

const conectarSql = async () => {
  try {
    const connection = await sql.connect(sqlParametros);
    return connection;
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  }
};

module.exports = conectarSql;
