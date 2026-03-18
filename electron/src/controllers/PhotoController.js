import PhotoService from "../services/PhotoService.js";

class PhotoController {
  static async getPhotosProduct(filters = {}) {
    return await PhotoService.getPhotosProduct(filters);
  }
}

export default PhotoController;
