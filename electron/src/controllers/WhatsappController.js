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

      // Excluir contato do banco de dados
      return await WhatsappService.deleteContact(contactId);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while deleting the contact.",
      };
    }
  }

  static async addContact(contactData, decodedToken) {
    try {
      const { name, number, cnpj } = contactData;
      if (!name || !number || !cnpj) {
        return {
          success: false,
          error: "Invalid contact data.",
        };
      }

      // Verificar se o número já existe para evitar duplicidade
      const existingContacts = await WhatsappController.getContacts({
        CONTATO_NUMERO: number,
      });

      if (existingContacts.success && existingContacts.data.length > 0) {
        return {
          success: false,
          error: "A contact with this number already exists.",
        };
      }
      console.log(decodedToken);

      // Criar novo contato no banco de dados
      return await WhatsappService.addContact({
        name,
        number,
        cnpj,
        sellerId: decodedToken.id,
      });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while adding the contact.",
      };
    }
  }

  static async startSession(decodedToken) {
    try {
      // Pega a sessão da Sessão
      const session = await WhatsappService.getSession(decodedToken.id);

      const [sessionStatusResult, sessionConnectionResult] = await Promise.all([
        // Verifica Status da Sessão
        WhatsappService.getSessionStatus(session),
        // Verifica a Conexão com o Whatsapp
        WhatsappService.checkWhatsappConnection(session),
      ]);

      if (
        sessionStatusResult?.data?.status === "CONNECTED" &&
        sessionConnectionResult?.data?.message === "Connected"
      ) {
        return {
          success: true,
          message: "Session is already connected.",
          data: {
            isOpen: true,
            isConnected: true,
          },
        };
      }

      // Retorna QR Code se necessário
      const startSessionResult = await WhatsappService.startSession(session);

      if (!startSessionResult.success) {
        return {
          success: false,
          error: startSessionResult.error,
          message: "Failed to start session.",
        };
      }

      return {
        success: true,
        data: {
          ...startSessionResult.data,
          isOpen: sessionStatusResult?.data?.status === "CONNECTED",
          isConnected: sessionConnectionResult?.data?.message === "Connected",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while starting the session.",
      };
    }
  }
}

export default WhatsappController;
