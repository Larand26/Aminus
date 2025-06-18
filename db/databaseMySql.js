const mysql = require("mysql2/promise");
const {
  DB_HOST_MYSQL,
  DB_USER_MYSQL,
  DB_PASSWORD_MYSQL,
  DB_DATABASE_MYSQL,
  DB_PORT_MYSQL,
} = require("../globals");

const sqlParametros = {
  host: DB_HOST_MYSQL,
  user: DB_USER_MYSQL,
  password: DB_PASSWORD_MYSQL,
  database: DB_DATABASE_MYSQL,
  port: DB_PORT_MYSQL,
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
