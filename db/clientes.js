const conectarSql = require("../config/database");

const searchCliente = async (cliente) => {
  const connection = await conectarSql();
  try {
    // Busca todos os ID_CODCLIENTE relevantes
    let query = "FROM [ENTIDADES] WHERE [ID_CODFILIAIS] = '1'";
    if (cliente) {
      if (cliente.nome)
        query += ` AND [ENTI_RAZAOSOCIAL] LIKE '%${cliente.nome}%'`;
      if (cliente.cnpj) query += ` AND [ENTI_CNPJCPF] = '${cliente.cnpj}'`;
      if (cliente.id) query += ` AND [ID_CODENTIDADE] = '${cliente.id}'`;
      if (cliente.celular)
        query += ` AND [ENTI_CELULAR] LIKE '%${cliente.celular}%'`;
      if (cliente.email) query += ` AND [ENTI_EMAIL] LIKE '%${cliente.email}%'`;
    }
    console.log("SELECT * " + query);

    const vwClienteResult = await connection
      .request()
      .query("SELECT * " + query);

    return vwClienteResult.recordset;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
  } finally {
    connection.close();
  }
};

module.exports = { searchCliente };
