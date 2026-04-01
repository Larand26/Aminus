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
      const contactResult = await WhatsappController.getContacts({ id });

      if (
        !contactResult.success ||
        !contactResult.data ||
        contactResult.data.length === 0
      ) {
        return {
          success: false,
          error: "Contact not found.",
        };
      }

      const contact = contactResult.data[0];

      // Verificar se o contato pertence ao vendedor do token
      if (contact.VENDEDOR_ID !== decodedToken.id && decodedToken.role !== 1) {
        return {
          success: false,
          error: "You do not have permission to edit this contact.",
        };
      }

      // Atualizar contato no banco de dados
      return await WhatsappService.saveEditedContact(contactData);
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
