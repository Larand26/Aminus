import WhatsappService from "../services/WhatsappService.js";

class WhatsappController {
  static async verifyContactOwnership(contactId, decodedToken) {
    const contactResult = await WhatsappController.getContacts({
      id: contactId,
    });

    if (
      !contactResult.success ||
      !contactResult.data ||
      contactResult.data.length === 0
    ) {
      return false;
    }

    const contact = contactResult.data[0];

    return contact.VENDEDOR_ID === decodedToken.id || decodedToken.role === 1;
  }

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
      const { id, name, number, cnpj } = contactData;

      if (!name || !number || !cnpj) {
        return {
          success: false,
          error: "Invalid contact data.",
        };
      }

      const isOwner = await this.verifyContactOwnership(id, decodedToken);
      if (!isOwner) {
        return {
          success: false,
          error: "You do not have permission to edit this contact.",
        };
      }

      // Verifica se o número tem algo diferente do número atual
      if (
        contact.CONTATO_NUMERO == number &&
        contact.CONTATO_NOME === name &&
        contact.CONTATO_CNPJ === cnpj
      ) {
        if (numberExists) {
          return {
            success: true,
            error: "Contact data is identical to the existing one.",
          };
        }
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

  static async deleteContact(contactId, decodedToken) {
    try {
      if (!contactId) {
        return {
          success: false,
          error: "Invalid contact ID.",
        };
      }

      const isOwner = await this.verifyContactOwnership(
        contactId,
        decodedToken,
      );
      if (!isOwner) {
        return {
          success: false,
          error: "You do not have permission to delete this contact.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while deleting the contact.",
      };
    }
  }
}

export default WhatsappController;
