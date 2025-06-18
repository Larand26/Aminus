const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const getCsv = async (arg) => {
  try {
    const caminho =
      arg ||
      path.join(
        process.env.HOME || process.env.USERPROFILE,
        "Desktop",
        "CSV dos repasses.csv"
      );

    // Lê o conteúdo do arquivo
    const fileContent = fs.readFileSync(caminho, "utf-8");

    // Faz o parse do CSV para um array de objetos
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ";",
      relax_column_count: true,
    });

    // Agrupa e soma "Valor Nominal" por "Nº da NF" e guarda as parcelas e valores de repasse
    const agrupados = {};
    for (const record of records) {
      const numeroNF = record["Nº da NF"];
      const valorNominal =
        parseFloat(
          String(record["Valor Nominal"]).replace(/\./g, "").replace(",", ".")
        ) || 0;
      const valorRepasse =
        parseFloat(
          String(record["Valor de Repasse"])
            .replace(/\./g, "")
            .replace(",", ".")
        ) || 0;

      if (agrupados[numeroNF]) {
        agrupados[numeroNF]["Valor Nominal"] += valorNominal;
        agrupados[numeroNF].parcelas.push(valorNominal);
        agrupados[numeroNF].valoresRepasse.push(valorRepasse);
      } else {
        agrupados[numeroNF] = {
          ...record,
          "Valor Nominal": valorNominal,
          parcelas: [valorNominal],
          valoresRepasse: [valorRepasse],
        };
      }
    }

    // Formata o resultado final
    const resultado = Object.values(agrupados).map((item) => ({
      ...item,
      "Valor Nominal": item["Valor Nominal"].toFixed(2),
      parcelas: item.parcelas.map((v) => Number(v.toFixed(2))),
      valoresRepasse: item.valoresRepasse.map((v) => Number(v.toFixed(2))),
    }));

    return resultado;
  } catch (error) {
    console.error("Error fetching CSV data:", error);
    throw error;
  }
};

module.exports = { getCsv };
