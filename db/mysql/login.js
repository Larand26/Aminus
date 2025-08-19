const connectMySql = require("../../config/databaseMySql");

const login = async (user, password) => {
  try {
    const connection = await connectMySql();
    const [rows] = await connection.execute(
      "SELECT * FROM USUARIOS WHERE NOME = ? AND SENHA = ?",
      [user, password]
    );
    connection.end();

    if (rows.length > 0) {
      return { success: true, data: rows[0] };
    } else {
      throw new Error("Usuário ou senha inválidos");
    }
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};

module.exports = {
  login,
};
