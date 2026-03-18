import FrenetService from "../services/FrenetService.js";

class FrenetController {
  static async calculateFreight(args) {
    try {
      return await FrenetService.calculateFreight(args);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while calculating freight.",
      };
    }
  }
}

export default FrenetController;
