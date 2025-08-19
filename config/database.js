const sql = require("mssql");
const path = require("path");
const globals = require(path.join(__dirname, "../globals"));

const sqlParametros = {
  user: globals.DB_USER,
  password: globals.DB_PASSWORD,
  server: globals.DB_HOST,
  database: globals.DB_DATABASE,
  port: Number(globals.DB_PORT),
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
