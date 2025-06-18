const connectMySql = require("./databaseMySql");

const getControlePlaza = async () => {
  const connection = await connectMySql();
  const [rows] = await connection.query("SELECT * FROM controle_plaza");
  await connection.end();
  return rows;
};

module.exports = { getControlePlaza };
