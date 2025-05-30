const sql = require("mssql");
require("dotenv").config();

const sqlParametros = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  connectionTimeout: 10000,
};

const conectarSql = async () => {
  try {
    const connection = await sql.connect(sqlParametros);
    console.log("Conexão bem-sucedida ao banco de dados SQL Server!");
    return connection;
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  }
};

module.exports = conectarSql;
