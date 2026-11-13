import Utils from "./Utils";

/**
 * Produto do banco `catalog` como chega do IPC `get-photos`.
 * @typedef {Object} CatalogProduct
 * @property {number} id_product
 * @property {string} manufacturer_code
 * @property {string} packing
 * @property {number} resale_price
 * @property {string} description
 * @property {number} id_color
 * @property {string} color_name
 * @property {string} color_code
 * @property {Array<{id_photo: number, url: string, position: number}>} photos
 */

class Photo {
  /** @param {CatalogProduct} product */
  static getPhotoUrls(product) {
    return (product?.photos || [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((photo) => photo.url);
  }

  /** @returns {Promise<{success: boolean, data?: Array<CatalogProduct>, error?: string, message?: string}>} */
  static async getPhotos(args) {
    const { token, filters } = args;
    try {
      const response = await window.api.getPhotos({ token, filters });
      if (!response.success) return response;
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching products.",
      };
    }
  }

  /**
   * @param {{token: string, oldProduct: CatalogProduct, newProduct: Object}} args
   */
  static async updatePhoto(args) {
    const { token, oldProduct, newProduct } = args;
    try {
      const newData = {
        manufacturer_code: newProduct.manufacturer,
        packing: newProduct.packaging,
        resale_price: newProduct.resalePrice,
        description: newProduct.description,
        color_name: newProduct.colorName,
        color_code: newProduct.colorCode,
        photos: newProduct.photos || [],
        apply_eva: Boolean(newProduct.applyEva),
      };

      const fieldsEqual =
        newData.manufacturer_code === oldProduct.manufacturer_code &&
        newData.packing === oldProduct.packing &&
        String(newData.resale_price) === String(oldProduct.resale_price) &&
        newData.description === oldProduct.description &&
        newData.color_name === oldProduct.color_name &&
        newData.color_code === oldProduct.color_code;
      const photosEqual = Utils.arePhotoArraysEqual(
        Photo.getPhotoUrls(oldProduct),
        newData.photos,
      );

      if (fieldsEqual && photosEqual && !newData.apply_eva) {
        return {
          success: true,
          unchanged: true,
          message: "No changes detected. The product was not updated.",
        };
      }

      const response = await window.api.updatePhoto({
        token,
        id: oldProduct.id_product,
        newData,
      });

      if (!response.success) return response;
      return {
        success: true,
        data: response.data,
        message: "Product updated successfully.",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while updating the product.",
      };
    }
  }

  /** @param {{token: string, products: Array<CatalogProduct>}} args */
  static async downloadPhoto(args) {
    const { token, products } = args;
    try {
      const response = await window.api.downloadPhoto({
        token,
        productIds: products.map((product) => product.id_product),
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while downloading photos.",
      };
    }
  }

  /** @param {{token: string, productId: number}} args */
  static async deletePhoto(args) {
    const { token, productId } = args;
    try {
      const response = await window.api.deletePhoto({
        token,
        productId,
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while deleting the photo.",
      };
    }
  }

  static async createPhoto(args) {
    const { token, newPhotos } = args;
    try {
      const response = await window.api.createPhoto({
        token,
        newPhotos,
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while creating the photos.",
      };
    }
  }
}
export default Photo;
