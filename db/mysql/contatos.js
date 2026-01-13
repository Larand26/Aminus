const connectMySql = require("../../config/databaseMySql");

const pegaContatos = async (filtros) => {
  try {
    const connection = await connectMySql();

    let query = "SELECT * FROM CONTATOS WHERE 1=1";
    let params = [];

    if (filtros?.nome) {
      query += " AND CONTATO_NOME LIKE ?";
      params.push(`%${filtros.nome}%`);
    }
    if (filtros?.numero) {
      query += " AND CONTATO_NUMERO = ?";
      params.push(filtros.numero);
    }
    if (filtros?.vendedorId) {
      query += " AND VENDEDOR_ID = ?";
      params.push(filtros.vendedorId);
    }

    const [rows] = await connection.execute(query, params);
    connection.end();

    return { success: true, data: rows };
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};

const adicionaContato = async (contato) => {
  try {
    const connection = await connectMySql();
    const query =
      "INSERT INTO CONTATOS (CONTATO_NOME, CONTATO_NUMERO, CONTATO_CNPJ, VENDEDOR_ID) VALUES (?, ?, ?, ?)";
    const params = [
      contato.nome.toUpperCase(),
      contato.numero?.replace(/\D/g, "") ?? null,
      contato.cnpj?.replace(/\D/g, "") ?? null,
      contato.vendedorId,
    ];
    await connection.execute(query, params);
    connection.end();

    return { success: true, data: "Contato adicionado com sucesso" };
  } catch (error) {
    console.error("Erro ao adicionar contato:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};

const editaContato = async (contato) => {
  try {
    const connection = await connectMySql();
    const query =
      "UPDATE CONTATOS SET CONTATO_NOME = ?, CONTATO_NUMERO = ?, CONTATO_CNPJ = ? WHERE CONTATO_ID = ?";
    const params = [
      contato.CONTATO_NOME.toUpperCase(),
      contato.CONTATO_NUMERO?.replace(/\D/g, "") ?? null,
      contato.CONTATO_CNPJ?.replace(/\D/g, "") ?? null,
      contato.CONTATO_ID,
    ];
    await connection.execute(query, params);
    connection.end();
    return { success: true, data: "Contato editado com sucesso" };
  } catch (error) {
    console.error("Erro ao editar contato:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};

module.exports = {
  pegaContatos,
  adicionaContato,
  editaContato,
};
