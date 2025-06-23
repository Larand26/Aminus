const mysql = require("mysql2/promise");
require("dotenv").config();

const sqlParametros = {
  host: process.env.DB_HOST_MYSQL,
  user: process.env.DB_USER_MYSQL,
  password: process.env.DB_PASSWORD_MYSQL,
  database: process.env.DB_DATABASE_MYSQL,
  port: Number(process.env.DB_PORT_MYSQL),
};

const connectMySql = async () => {
  try {
    const connection = await mysql.createConnection(sqlParametros);
    await connection.connect();
    // console.log("Conexão bem-sucedida ao banco de dados!");
    return connection;
  } catch (err) {
    console.log("Erro ao se conectar com o banco de dados " + err);
  }
};
connectMySql();
module.exports = connectMySql;
