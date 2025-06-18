const connectMySql = require("./databaseMySql");
const toMysqlDate = (dateStr) => {
  if (!dateStr) return null;
  // Aceita datas no formato DD/MM/YYYY
  const [dia, mes, ano] = dateStr.split("/");
  if (!dia || !mes || !ano) return null;
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};
const insertCsvMysql = async (csvData) => {
  try {
    const connection = await connectMySql();
    const insertQuery = `
      INSERT INTO controle_plaza (ACAO, STATUS, TRANSFERIDO_SELLER, CNPJ, RAZAO_SOCIAL, SELLER, DATA_OPERACAO, NUMERO_NF, VALOR_NOMINAL, TAXA_PLAZA, TAXA_LIBER, DATA_VENCIMENTO, VALOR_REPASSE, REPASSE_FINAL, DATA_PAGAMENTO, DATA_ENTREGA, NUMERO_PEDIDO, TRANSPORTADORA)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const record of csvData) {
      const values = [
        //Ação
        0,
        //Status
        "Crédito em Conta",
        //Transferido Seller
        parseFloat(
          record["Valor Nominal"].replace(/\./g, "").replace(",", ".")
        ) -
          parseFloat(
            record["Valor Nominal"].replace(/\./g, "").replace(",", ".")
          ) *
            0.11,
        //CNPJ
        record["CNPJ"],
        //Razão Social
        record["Razão Social"],
        //Seller
        record["Seller"],
        //Data Operação
        toMysqlDate(record["Data da Operação"]), // DATA_OPERACAO
        //Número NF
        record["Nº da NF"],
        //Valor Nominal
        record.parcelas.join(" | "),
        //Taxa Plaza
        parseFloat(
          record["Valor Nominal"].replace(/\./g, "").replace(",", ".")
        ) * 0.06,
        //Taxa Liber
        parseFloat(
          record["Valor Nominal"].replace(/\./g, "").replace(",", ".")
        ) * 0.05,
        //Data Vencimento
        toMysqlDate(record["Data de Vencimento"]), // DATA_VENCIMENTO
        //Valor de Repasse
        record.valoresRepasse.join(" | "),
        //Repasse Final
        parseFloat(
          (record["Repasse final do Lote"] || "0")
            .replace(/\./g, "")
            .replace(",", ".")
        ),
        //Data Pagamento
        toMysqlDate(record["Data do pagamento"]), // DATA_PAGAMENTO
        // Número Pedido
        null,
        //Data Entrega
        null,
        //Transportadora
        null,
      ];
      try {
        await connection.execute(insertQuery, values);
      } catch (error) {
        if (error.code !== "ER_DUP_ENTRY") {
          console.error("Erro ao inserir registro:", error);
          throw error; // só lança erro se não for duplicado
        }
      }
    }

    await connection.end();
    console.log("CSV inserido com sucesso no MySQL!");
  } catch (error) {
    console.error("Erro ao inserir CSV no MySQL:", error);
    throw error;
  }
};
module.exports = { insertCsvMysql };
