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

  static async getOrderItems(orderId) {
    try {
      return await OrderService.getOrderItems(orderId);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching order items.",
      };
    }
  }

  static async generateCubagePDF(itens) {
    try {
      return await OrderService.generateCubagePDF(itens);
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while generating the cubage PDF.",
      };
    }
  }
}

export default OrderController;
