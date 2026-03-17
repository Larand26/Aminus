import ProductService from "../services/ProductService.js";

class ProductController {
  static getProducts(filters = {}) {
    try {
      return ProductService.getProducts(filters);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching products.",
      };
    }
  }

  static async getProductReservations(filters = {}) {
    try {
      return await ProductService.getProductReservations(filters);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching product reservations.",
      };
    }
  }

  static async getProductRegistrations(filters = {}) {
    try {
      return await ProductService.getProductRegistrations(filters);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching registration products.",
      };
    }
  }
}

export default ProductController;
