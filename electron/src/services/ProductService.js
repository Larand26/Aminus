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
  manufacturerCode: { condition: `P.[PROD_CODFABRIC] = @manufacturerCode` },
  productCode: { condition: `P.[ID_CODPRODUTO] = @productCode` },
  productBarcode: { condition: `P.[PROD_CODBARRA] = @productBarcode` },
  productDescription: {
    condition: `P.[PROD_DESCRCOMPLETA] LIKE @productDescription`,
    transform: (v) => `%${v}%`,
  },
  productQuantity: {
    condition: `(P.[PROD_ESTATUAL] - ISNULL(R.QuantidadeReservada, 0)) >= @productQuantity`,
  },
};

const RESERVATION_FILTER_MAP = {
  productCode: { condition: `PR.[ID_CODPRODUTO] = @productCode` },
  manufacturerCode: { condition: `P.[PROD_CODFABRIC] = @manufacturerCode` },
  orderCode: { condition: `PR.[ID_NUMPEDORC] = @orderCode` },
  clientName: {
    condition: `PO.[PEDOR_RAZAOSOCIAL] LIKE @clientName`,
    transform: (v) => `%${v}%`,
  },
  sellerId: { condition: `PO.[ID_CODVENDEDOR] = @sellerId` },
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

class ProductService {
  /**
   * Pega os produtos do banco de dados de acordo com os filtros passados
   * @param {Object} filters {manufacturerCode, productCode, productBarcode, productDescription, productQuantity}
   * @return {Promise<{success: boolean, data: Object[]|null, error: string|null}>}
   */
  static async getProducts(filters = {}) {
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

      const filterConditions =
        extraConditions.length > 0
          ? `AND ${extraConditions.join(" AND ")}`
          : "";

      const finalQuery = BASE_QUERY.replace(
        FILTER_PLACEHOLDER,
        filterConditions,
      );

      const products = await SQLServerDB.query(finalQuery, params);

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
   *
   * @param {Object} filters { productCode Number, manufacturerCode String, orderCode Number, clientName String, sellerId Number }
   * @return {Promise<{success: boolean, data: Object[]|null, error: string|null}>}
   */
  static async getProductReservations(filters = {}) {
    try {
      const safeFilters = filters && typeof filters === "object" ? filters : {};
      const params = [];
      const extraConditions = [];

      for (const [key, { condition, transform }] of Object.entries(
        RESERVATION_FILTER_MAP,
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

      const filterConditions =
        extraConditions.length > 0
          ? `AND ${extraConditions.join(" AND ")}`
          : "";

      const finalQuery = RESERVATION_BASE_QUERY.replace(
        FILTER_PLACEHOLDER,
        filterConditions,
      );

      const productReservations = await SQLServerDB.query(finalQuery, params);

      return {
        success: true,
        data: productReservations,
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
