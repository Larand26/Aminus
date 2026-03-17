import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import SQLServerDB from "../database/SQLServerDB.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_QUERY = readFileSync(
  path.resolve(__dirname, "../database/queries/queryClient.sql"),
  "utf-8",
);
const FILTER_PLACEHOLDER = "-- Os filtros serão adicionados aqui pelo Node.js";

const FILTER_MAP = {
  numClient: { condition: `E.[ID_CODENTIDADE] = @numClient` },
  name: {
    condition: `E.[ENTI_RAZAOSOCIAL] LIKE @name`,
    transform: (v) => `%${v}%`,
  },
  cnpj: { condition: `E.[ENTI_CNPJCPF] = @cnpj` },
  celphone: {
    condition: `E.[ENTI_CELULAR] LIKE @celphone`,
    transform: (v) => `%${v}%`,
  },
  email: {
    condition: `E.[ENTI_EMAIL] LIKE @email`,
    transform: (v) => `%${v}%`,
  },
};

const hasFilterValue = (value) => {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
};

class ClientService {
  /**
   * Pega os clientes com base nos filtros fornecidos
   * @param {Object} filters { numClient, name, cnpj, celphone, email }
   * @returns {Promise<Array|Object>} Array of clients or error object
   */
  static async getClients(filters = {}) {
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
      const clients = await SQLServerDB.query(query, params);

      return {
        success: true,
        data: clients,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching clients.",
      };
    }
  }
}

export default ClientService;
