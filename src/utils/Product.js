class Product {
  static async getProducts(args) {
    const { token, filters } = args;
    try {
      return await window.api.getProducts({ token, filters });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching products.",
      };
    }
  }
}

export default Product;
