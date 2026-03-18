import MongoDB from "../database/MongoDB.js";
import ProductModel from "../models/ProductModel.js";

class PhotoService {
  static async getPhotosProduct(filters = {}) {
    try {
      const mongoFilters = {};

      if (filters.codFabric) mongoFilters.referencia = filters.codFabric;
      if (filters.codColor) mongoFilters.codigo_cor = filters.codColor;

      return await MongoDB.find(ProductModel, mongoFilters);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching photos.",
      };
    }
  }

  static async updatePhoto(args) {
    const { id, newData } = args;
    try {
      return await MongoDB.update(ProductModel, id, newData);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while updating the photo.",
      };
    }
  }

  static async createPhoto(args) {
    try {
      const existingPhoto = await MongoDB.find(ProductModel, {
        referencia: args.referencia,
      });
      if (
        existingPhoto.length > 0 &&
        existingPhoto.some(
          (photo) =>
            photo.codigo_cor === args.codColor ||
            photo.nome_cor === args.nameColor,
        )
      ) {
        return {
          success: false,
          error: "Photo already exists.",
          message: "A photo with the same reference and color already exists.",
        };
      }

      const newPhoto = {
        referencia: args.referencia,
        codigo_cor: args.codColor,
        nome_cor: args.nameColor,
        descricao_produto: existingPhoto[0].descricao_produto,
        preco_revenda: existingPhoto[0].preco_revenda,
        embalamento: existingPhoto[0].embalamento,
        fotos: args.photos,
        video_url: args.url,
      };

      return await MongoDB.create(ProductModel, newPhoto);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while creating the photo.",
      };
    }
  }
}

export default PhotoService;
