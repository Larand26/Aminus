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

  static async getProductReservations(args) {
    const { token, filters } = args;
    try {
      return await window.api.getProductReservations({ token, filters });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching product reservations.",
      };
    }
  }

  static async getDateReservation(args) {
    try {
      return await window.api.getDateReservation(args);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching date reservations.",
      };
    }
  }

  static async getProductRegistrations(args) {
    const { token, filters } = args;
    try {
      return await window.api.getProductRegistrations({ token, filters });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching registration products.",
      };
    }
  }

  static async getColors(args) {
    try {
      return await window.api.getColors(args);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching colors.",
      };
    }
  }

  static async createColor(args) {
    try {
      return await window.api.createColor(args);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while creating color.",
      };
    }
  }

  static async registerProducts(args) {
    const { token, products, description, parentProduct } = args;
    try {
      //{description: string, productParent: string, colorId: number, isActive: boolean, isIntegrated: boolean}

      const formattedProducts = products.map((prod) => ({
        description: description,
        productParent: parentProduct,
        colorId: prod.COD_COR_ECOMMERCE || 1,
        isActive: prod?.ATIVO_ECOMMERCE || false,
        isIntegrated: prod?.INTEGRACAO_ECOMMERCE || false,
        productId: prod.COD_INTERNO,
      }));

      return await window.api.registerProducts({
        token,
        products: formattedProducts,
      });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while registering products.",
      };
    }
  }
}

export default Product;
