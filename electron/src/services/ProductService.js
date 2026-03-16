import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import SQLServerDB from "../database/SQLServerDB.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_QUERY = readFileSync(
  path.resolve(__dirname, "../database/queries/queryProduct.sql"),
  "utf-8",
);

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

      return SQLServerDB.query(`${BASE_QUERY} ${suffix}`, params);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching products.",
      };
    }
  }
}

export default ProductService;
