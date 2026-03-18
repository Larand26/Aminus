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
}

export default PhotoController;
