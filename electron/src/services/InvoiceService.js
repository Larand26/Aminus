import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import SQLServerDB from "../database/SQLServerDB.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_QUERY = readFileSync(
  path.resolve(__dirname, "../database/queries/queryInvoice.sql"),
  "utf-8",
);

const FILTER_MAP = {
  numNota: { condition: `NF.[NF_NUMDOCUM] = @numNota` },
  cnpj: { condition: `NF.[NF_CGCCPFENTIDADE] = @cnpj` },
  dataInicial: {
    condition: `CONVERT(date, NF.[NF_DATAEMIS]) >= CONVERT(date, @dataInicial)`,
  },
  dataFinal: {
    condition: `CONVERT(date, NF.[NF_DATAEMIS]) <= CONVERT(date, @dataFinal)`,
  },
  vendedor: { condition: `NF.[ID_CODVENDEDOR] = @vendedor` },
  uf: { condition: `NF.[NF_UNIDFEDENTD] = @uf` },
  transportadora: { condition: `NF.[ID_CODTRANSP] = @transportadora` },
};

const hasFilterValue = (value) => {
  if (value == null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim() !== "";
  }

  return true;
};

class InvoiceService {
  /**
   * Pega as notas fiscais com base nos filtros fornecidos
   * @param {Object} filters { numNota, cnpj, dataInicial, dataFinal, vendedor, uf, transportadora }
   * @returns {Promise<Array|Object>} Array of invoices or error object
   */
  static async getInvoices(filters = {}) {
    try {
      const safeFilters = filters && typeof filters === "object" ? filters : {};
      const params = [];
      const extraConditions = [];

      for (const [key, { condition, transform }] of Object.entries(
        FILTER_MAP,
      )) {
        if (!hasFilterValue(safeFilters[key])) {
          continue;
        }

        params.push({
          name: key,
          value: transform ? transform(safeFilters[key]) : safeFilters[key],
        });
        extraConditions.push(condition);
      }

      const suffix =
        extraConditions.length > 0
          ? `AND ${extraConditions.join(" AND ")}`
          : "";

      const invoices = await SQLServerDB.query(
        `${BASE_QUERY} ${suffix}`,
        params,
      );

      return {
        success: true,
        data: invoices,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching invoices.",
      };
    }
  }
}

export default InvoiceService;
