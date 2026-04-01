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

  static async saveEditedContact(contactData, decodedToken) {
    try {
      const { id } = contactData;
      const contact = await WhatsappController.getContacts({ id });
      console.log(contact);
      return {
        success: true,
        data: contact,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while saving the contact.",
      };
    }
  }
}

export default WhatsappController;
