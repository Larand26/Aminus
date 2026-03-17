import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import SQLServerDB from "../database/SQLServerDB.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_QUERY = readFileSync(
  path.resolve(__dirname, "../database/queries/queryOrder.sql"),
  "utf-8",
);
const FILTER_PLACEHOLDER = "-- Os filtros serão adicionados aqui pelo Node.js";

const FILTER_MAP = {
  numOrder: { condition: `PO.[ID_NUMPEDORC] = @numOrder` },
  cnpj: { condition: `E.[ENTI_CNPJCPF] = @cnpj` },
  client: {
    condition: `E.[ENTI_RAZAOSOCIAL] LIKE @client`,
    transform: (v) => `%${v}%`,
  },
  initialDate: {
    condition: `CONVERT(date, PO.[PEDOR_DATA]) >= CONVERT(date, @initialDate)`,
  },
  finalDate: {
    condition: `CONVERT(date, PO.[PEDOR_DATA]) <= CONVERT(date, @finalDate)`,
  },
  sellerId: { condition: `PO.[ID_CODVENDEDOR] = @sellerId` },
  transportadora: { condition: `PO.[ID_TRANSPORTADORA] = @transportadora` },
  status: { condition: `PO.[PEDOR_SITUACAO] = @status` },
};

const hasFilterValue = (value) => {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
};

class OrderService {
  /**
   * Pega os pedidos com base nos filtros fornecidos
   * @param {Object} filters { numOrder String, cnpj String, client String, initialDate Date, finalDate Date, sellerId Number, status String }
   * @returns {Promise<Array|Object>} Array of orders or error object
   */
  static async getOrders(filters = {}) {
    try {
      const safeFilters = filters && typeof filters === "object" ? filters : {};
      const params = [];
      const extraConditions = [];

      for (const [key, { condition, transform }] of Object.entries(
        FILTER_MAP,
      )) {
        if (!hasFilterValue(safeFilters[key])) continue;

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

      const query = BASE_QUERY.replace(FILTER_PLACEHOLDER, suffix);

      const orders = await SQLServerDB.query(query, params);

      return {
        success: true,
        data: orders,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching orders.",
      };
    }
  }
}

export default OrderService;
