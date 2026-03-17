import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import SQLServerDB from "../database/SQLServerDB.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_QUERY = readFileSync(
  path.resolve(__dirname, "../database/queries/queryProduct.sql"),
  "utf-8",
);
const RESERVATION_BASE_QUERY = readFileSync(
  path.resolve(__dirname, "../database/queries/qureyReservationProduct.sql"),
  "utf-8",
);
const FILTER_PLACEHOLDER = "-- Os filtros serão adicionados aqui pelo Node.js";

const FILTER_MAP = {
  idProduto: { condition: `P.[ID_CODPRODUTO] = @idProduto` },
  idFabric: { condition: `P.[PROD_CODFABRIC] = @idFabric` },
  barcode: { condition: `P.[PROD_CODBARRA] = @barcode` },
  quantity: {
    condition: `(P.[PROD_ESTATUAL] - ISNULL(R.QuantidadeReservada, 0)) >= @quantity`,
  },
  description: {
    condition: `P.[PROD_DESCRCOMPLETA] LIKE @description`,
    transform: (v) => `%${v}%`,
  },
};

const RESERVATION_FILTER_MAP = {
  codFabricante: { condition: `P.[PROD_CODFABRIC] = @codFabricante` },
  codInterno: { condition: `PR.[ID_CODPRODUTO] = @codInterno` },
  numPedido: { condition: `PR.[ID_NUMPEDORC] = @numPedido` },
  nomeCliente: {
    condition: `PO.[PEDOR_RAZAOSOCIAL] LIKE @nomeCliente`,
    transform: (v) => `%${v}%`,
  },
  vendedor: { condition: `PO.[ID_CODVENDEDOR] = @vendedor` },
};

const hasFilterValue = (value) => {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
};

class ProductService {
  /**
   * Pega os produtos com base nos filtros fornecidos
   * @param {Object} filters { idProduto, idFabric, barcode, quantity, description }
   * @returns {Promise<Array|Object>} Array of products or error object
   */
  static async getProducts(filters = {}) {
    try {
      const safeFilters = filters && typeof filters === "object" ? filters : {};
      const params = [];
      const extraConditions = [];

      for (const [key, { condition, transform }] of Object.entries(
        FILTER_MAP,
      )) {
        if (safeFilters[key] != null) {
          params.push({
            name: key,
            value: transform ? transform(safeFilters[key]) : safeFilters[key],
          });
          extraConditions.push(condition);
        }
      }

      const suffix =
        extraConditions.length > 0
          ? `AND ${extraConditions.join(" AND ")}`
          : "";

      const products = await SQLServerDB.query(
        `${BASE_QUERY} ${suffix}`,
        params,
      );

      return {
        success: true,
        data: products,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching products.",
      };
    }
  }

  /**
   * Pega as reservas de produto com base nos filtros fornecidos
   * @param {Object} filters { codFabricante, codInterno, numPedido, nomeCliente, vendedor }
   * @returns {Promise<Array|Object>} Array of reservations or error object
   */
  static async getProductReservations(filters = {}) {
    try {
      const safeFilters = filters && typeof filters === "object" ? filters : {};
      const params = [];
      const extraConditions = [];

      for (const [key, { condition, transform }] of Object.entries(
        RESERVATION_FILTER_MAP,
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

      const query = RESERVATION_BASE_QUERY.replace(FILTER_PLACEHOLDER, suffix);
      const reservations = await SQLServerDB.query(query, params);

      return {
        success: true,
        data: reservations,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching product reservations.",
      };
    }
  }
}

export default ProductService;
