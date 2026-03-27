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
  path.resolve(__dirname, "../database/queries/queryReservationProduct.sql"),
  "utf-8",
);
const DATE_RESERVATION_BASE_QUERY = readFileSync(
  path.resolve(__dirname, "../database/queries/queryDateReservation.sql"),
  "utf-8",
);
const REGISTRATION_BASE_QUERY = readFileSync(
  path.resolve(__dirname, "../database/queries/queryRegistrationProduct.sql"),
  "utf-8",
);
const REGISTRATION_FILTER_MAP = {
  manufacturer: {
    condition: `P.[PROD_CODFABRIC] = @manufacturer`,
  },
  productCode: {
    condition: `P.[ID_CODPRODUTO] = @productCode`,
  },
};
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

const DATE_RESERVATION_FILTER_MAP = {
  initialDate: {
    condition: `CONVERT(date, DATA) >= CONVERT(date, @initialDate)`,
  },
  finalDate: {
    condition: `CONVERT(date, DATA) <= CONVERT(date, @finalDate)`,
  },
  orderCode: {
    condition: `ATIVIDADE LIKE @orderCode`,
    transform: (v) => `%${v}%`,
  },
  productCode: {
    condition: `ATIVIDADE LIKE @productCode`,
    transform: (v) => `%${v}%`,
  },
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

  /**
   *
   * @param {Object} filters { initialDate Date, finalDate Date, productCode Number, orderCode Number }
   * @returns {Promise<{success: boolean, data: Object[]|null, error: string|null}>}
   */
  static async getDateReservation(filters = {}) {
    try {
      const safeFilters = filters && typeof filters === "object" ? filters : {};
      const params = [];
      const extraConditions = [];

      for (const [key, { condition, transform }] of Object.entries(
        DATE_RESERVATION_FILTER_MAP,
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

      const finalQuery = DATE_RESERVATION_BASE_QUERY.replace(
        FILTER_PLACEHOLDER,
        filterConditions,
      );

      const dateReservations = await SQLServerDB.query(finalQuery, params);

      return {
        success: true,
        data: dateReservations,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching date reservations.",
      };
    }
  }
  /**
   * Pesquisa produtos de cadastro wev
   * @param {Object<{manufacturer: string, productCode: string}>} filters
   * @returns {Promise<{success: boolean, data: Object[]|null, error: string|null}>}
   */
  static async getProductRegistrations(filters = {}) {
    try {
      const safeFilters = filters && typeof filters === "object" ? filters : {};
      const params = [];
      const extraConditions = [];

      for (const [key, { condition, transform }] of Object.entries(
        REGISTRATION_FILTER_MAP,
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

      const finalQuery = REGISTRATION_BASE_QUERY.replace(
        FILTER_PLACEHOLDER,
        filterConditions,
      );

      const registrations = await SQLServerDB.query(finalQuery, params);

      return {
        success: true,
        data: registrations,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching product registrations.",
      };
    }
  }

  /**
   *
   *  @param {Object<{colorName: string}>} filters
   * @returns
   */
  static async getColors(filters = {}) {
    try {
      const { colorName } = filters;
      let query, params;
      if (colorName && colorName.trim() !== "") {
        query =
          "SELECT TOP 20 [ID_CHAVE] AS value, [DESCRICAO] AS label FROM [CORES_ECOMERCE] WHERE [DESCRICAO] LIKE @colorName + '%' ORDER BY CASE WHEN [DESCRICAO] = @colorName THEN 0 ELSE 1 END, [DESCRICAO]";
        params = [{ name: "colorName", value: colorName }];
      } else {
        query =
          "SELECT [ID_CHAVE] AS value, [DESCRICAO] AS label FROM [CORES_ECOMERCE] ORDER BY [DESCRICAO]";
        params = [];
      }
      const result = await SQLServerDB.query(query, params);
      return { data: result, success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching colors.",
      };
    }
  }

  /**
   *
   *  @param {Object<{colorName: string}>} filters
   * @returns
   */
  static async createColor(args) {
    try {
      const { colorName } = args;
      if (!colorName || colorName.trim() === "") {
        return {
          success: false,
          message: "Nome da cor é obrigatório.",
        };
      }

      // Verifica se já existe uma cor com a mesma descrição
      const checkQuery =
        "SELECT COUNT(*) AS total FROM [CORES_ECOMERCE] WHERE [DESCRICAO] = @colorName";
      const checkParams = [{ name: "colorName", value: colorName }];
      const checkResult = await SQLServerDB.query(checkQuery, checkParams);

      if (checkResult && checkResult[0] && checkResult[0].total > 0) {
        return { success: false, message: "Cor já existe" };
      }

      const insertQuery =
        "INSERT INTO [CORES_ECOMERCE] (DESCRICAO) VALUES (@colorName)";
      await SQLServerDB.query(insertQuery, checkParams);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while creating color.",
      };
    }
  }
}

export default ProductService;
