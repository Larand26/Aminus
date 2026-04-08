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
   * @param {Object<{newManufacturerCode: string, newPackaging: string, newDescription: string, newPhotos: { photo: Array<Buffer>, color: string, colorCode: string }  }>} newPhotos
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
      const resizedFilesData = await PhotoService.resizePhotos(args.products);
      if (!resizedFilesData.success) {
        return {
          success: false,
          error: resizedFilesData.error,
          message: "An error occurred while resizing photos.",
        };
      }
      return await PhotoService.downloadPhoto({
        products: resizedFilesData.data,
      });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while downloading the photo.",
      };
    }
  }

  static async deletePhoto(photoId) {
    try {
      return await PhotoService.deletePhoto(photoId);
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
