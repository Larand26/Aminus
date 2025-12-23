const connectMySql = require("../../config/databaseMySql");

const login = async (user, password) => {
  try {
    const connection = await connectMySql();
    const [rows] = await connection.execute(
      "SELECT U.ID_USUARIO, U.NOME, U.ID_FUNCAO_USUARIO, TF.DESCRICAO AS DESCRICAO_FUNCAO FROM USUARIOS U LEFT JOIN TIPO_USUARIO TF ON U.ID_FUNCAO_USUARIO = TF.ID_TIPO_USUARIO WHERE NOME = ? AND SENHA = ?",
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
