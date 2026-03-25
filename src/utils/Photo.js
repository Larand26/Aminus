class Photo {
  static async getPhotos(args) {
    const { token, filters } = args;
    try {
      return await window.api.getPhotos({ token, filters });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching products.",
      };
    }
  }
}
export default Photo;
