const mysql = require("mysql2/promise");
const path = require("path");
const globals = require(path.join(__dirname, "../globals"));

const sqlParametros = {
  host: globals.DB_HOST_MYSQL,
  user: globals.DB_USER_MYSQL,
  password: globals.DB_PASSWORD_MYSQL,
  database: globals.DB_DATABASE_MYSQL,
  port: Number(globals.DB_PORT_MYSQL),
};

const connectMySql = async () => {
  try {
    const connection = await mysql.createConnection(sqlParametros);
    await connection.connect();
    return connection;
  } catch (err) {
    console.log("Erro ao se conectar com o banco de dados " + err);
  }
};
connectMySql();
module.exports = connectMySql;
