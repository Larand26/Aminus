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
}

export default ProductController;
