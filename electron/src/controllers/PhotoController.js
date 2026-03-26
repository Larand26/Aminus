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

  static async createPhoto(args) {
    try {
      return await PhotoService.createPhoto(args);
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
}

export default PhotoController;
