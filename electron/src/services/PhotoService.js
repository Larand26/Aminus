import MongoDB from "../database/MongoDB.js";
import ProductModel from "../models/ProductModel.js";

class PhotoService {
  static async getPhotosProduct(filters = {}) {
    try {
      const mongoFilters = {};

      if (filters.codFabric) mongoFilters.referencia = filters.codFabric;
      if (filters.codColor) mongoFilters.codigo_cor = filters.codColor;

      return await MongoDB.query(ProductModel, mongoFilters);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching photos.",
      };
    }
  }
}

export default PhotoService;
