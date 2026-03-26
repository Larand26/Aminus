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

  static async getDateReservation(filters = {}) {
    try {
      return await ProductService.getDateReservation(filters);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching date reservations.",
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

  static async getColors(filters = {}) {
    try {
      return await ProductService.getColors(filters);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching colors.",
      };
    }
  }
}

export default ProductController;
