import loadEnv from "./loadEnv.js";

loadEnv();

class PhotosApiConfig {
  constructor() {
    this.baseUrl = (
      process.env.PHOTOS_API_URL ||
      "https://photos-api-production-95c4.up.railway.app"
    ).replace(/\/+$/, "");
    this.token = process.env.PHOTOS_API_TOKEN;
  }
}

export default new PhotosApiConfig();
