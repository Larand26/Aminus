import MongoDB from "../database/MongoDB.js";
import ProductModel from "../models/ProductModel.js";

class PhotoService {
  static async getPhotosProduct(filters = {}) {
    try {
      const mongoFilters = {};

      if (filters.manufacturer) mongoFilters.referencia = filters.manufacturer;
      if (filters.color) mongoFilters.codigo_cor = filters.color;

      const photos = await MongoDB.find(ProductModel, mongoFilters);
      return {
        success: true,
        data: photos,
      };
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
      const updatedPhoto = await MongoDB.update(ProductModel, id, newData);
      return {
        success: true,
        data: updatedPhoto,
      };
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

      const createdPhoto = await MongoDB.create(ProductModel, newPhoto);
      return {
        success: true,
        data: createdPhoto,
      };
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
