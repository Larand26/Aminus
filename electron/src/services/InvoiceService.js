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
  numInvoice: { condition: `NF.[NF_NUMDOCUM] = @numInvoice` },
  cnpj: { condition: `NF.[NF_CGCCPFENTIDADE] = @cnpj` },
  initialDate: {
    condition: `CONVERT(date, NF.[NF_DATAEMIS]) >= CONVERT(date, @initialDate)`,
  },
  finalDate: {
    condition: `CONVERT(date, NF.[NF_DATAEMIS]) <= CONVERT(date, @finalDate)`,
  },
  sellerId: { condition: `NF.[ID_CODVENDEDOR] = @sellerId` },
  uf: { condition: `NF.[NF_UNIDFEDENTD] = @uf` },
  transporter: { condition: `NF.[ID_CODTRANSP] = @transporter` },
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
   * @param {Object} filters { numInvoice String, cnpj String, initialDate Date, finalDate Date, sellerId Number, uf String, transporter Number }
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
