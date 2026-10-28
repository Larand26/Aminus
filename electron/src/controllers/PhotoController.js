import PhotoService from "../services/PhotoService.js";

class PhotoController {
  static async getPhotosProduct(filters = {}) {
    return await PhotoService.getPhotosProduct(filters);
  }

  static async updatePhoto(args) {
    try {
      return await PhotoService.updatePhoto(args);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while updating the photo.",
      };
    }
  }

  /**
   * Cria novas fotos para os produtos. O argumento `args` deve conter um array `newPhotos` com as informações das fotos a serem criadas.
   * @param {import("../services/PhotoService.js").NewPhotosPayload} newPhotos
   * @returns
   */
  static async createPhoto(newPhotos) {
    try {
      return await PhotoService.createPhoto(newPhotos);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while creating the photo.",
      };
    }
  }

  static async downloadPhoto(args) {
    try {
      return await PhotoService.downloadPhoto({ productIds: args.productIds });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while downloading the photo.",
      };
    }
  }

  static async deletePhoto(productId) {
    try {
      return await PhotoService.deletePhoto(productId);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while deleting the photo.",
      };
    }
  }
}

export default PhotoController;
