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
}

export default Product;
