class Order {
  static async getOrders(args) {
    const { token, filters } = args;
    try {
      return await window.api.getOrders({ token, filters });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching orders.",
      };
    }
  }
}

export default Order;
