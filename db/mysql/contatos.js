const connectMySql = require("../../config/databaseMySql");

const pegaContatos = async (vendedor) => {
  try {
    const connection = await connectMySql();
    const [rows] = await connection.execute(
      "SELECT * FROM CONTATOS WHERE VENDEDOR_ID = ?",
      [vendedor]
    );
    connection.end();

    return { success: true, data: rows[0] };
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};

module.exports = {
  pegaContatos,
};
