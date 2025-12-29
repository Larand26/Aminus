const connectMySql = require("../../config/databaseMySql");

const salvaInfos = async (args) => {
  try {
    const connection = await connectMySql();
    const {
      mensagem,
      mensagensEnviadas,
      mensagensNaoEnviadas,
      taxaAcerto,
      vendedorId,
    } = args;
    const query = `
            INSERT INTO CONTATOS_MENSAGENS (
                MENSAGENS_TEXTO, 
                MENSAGENS_ENVIADAS, 
                MENSAGENS_NAO_ENVIADAS, 
                MENSAGENS_TAXA_ACERTO, 
                MENSAGENS_DATA_ENVIO, 
                VENDEDOR_ID
            )
            VALUES (?, ?, ?, ?, NOW(), ?)
        `;
    const params = [
      mensagem,
      mensagensEnviadas,
      mensagensNaoEnviadas,
      taxaAcerto,
      vendedorId,
    ];
    await connection.execute(query, params);
    connection.end();
    return { success: true, data: "Informações salvas com sucesso" };
  } catch (error) {
    console.error("Erro ao salvar informações do dashboard WPP:", error);
    return { success: false, error: error.message || "Erro desconhecido" };
  }
};

module.exports = { salvaInfos };
