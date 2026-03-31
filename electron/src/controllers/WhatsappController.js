import WhatsappService from "../services/WhatsappService.js";

class WhatsappController {
  static async getContacts(filters) {
    try {
      return await WhatsappService.getContacts(filters);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching contacts.",
      };
    }
  }
}

export default WhatsappController;
