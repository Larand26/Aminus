import OrderService from "../services/OrderService.js";

class OrderController {
  static async getOrders(filters = {}) {
    try {
      return await OrderService.getOrders(filters);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching orders.",
      };
    }
  }
}

export default OrderController;
