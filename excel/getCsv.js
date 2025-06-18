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

    // Lê o conteúdo do arquivo (tente 'latin1' se continuar estranho)
    const fileContent = fs.readFileSync(caminho, "utf-8");

    // Faz o parse do CSV para um array de objetos
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ";", // <-- Adicione esta linha!
      relax_column_count: true, // <-- Ajuda a evitar erro se faltar coluna
    });

    return records;
  } catch (error) {
    console.error("Error fetching CSV data:", error);
    throw error;
  }
};

module.exports = { getCsv };
