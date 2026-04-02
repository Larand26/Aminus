import MySQLDB from "../database/MySQLDB.js";

import WppConnectConfig from "../config/WppConnectConfig.js";

import axios from "axios";

const filtersToQuery = {
  id: { condition: `CONTATOS.CONTATO_ID = ?` },
  cellphoneNumber: { condition: `CONTATOS.CONTATO_NUMERO = ?` },
  name: {
    condition: `CONTATOS.CONTATO_NOME LIKE ?`,
    transform: (v) => `%${v}%`,
  },
  sellerId: { condition: `CONTATOS.VENDEDOR_ID = ?` },
  sellerName: { condition: `USUARIOS.NOME LIKE ?` },
};

class WhatsappService {
  /**
   * Pega os contatos do banco de dados, filtrando por número de celular, nome do contato, id do vendedor ou nome do vendedor.
   * @param {Object<{id: string, cellphoneNumber: string, name: string, sellerId: string, sellerName: string}>} filters
   * @returns
   */
  static async getContacts(filters) {
    try {
      // Detectar tipo de DB
      const params = [];
      const conditions = [];
      const queryConditions = Object.keys(filters);
      for (const key of queryConditions) {
        if (filters[key]) {
          const filterConfig = filtersToQuery[key];
          conditions.push(filterConfig.condition);
          params.push(
            filterConfig.transform
              ? filterConfig.transform(filters[key])
              : filters[key],
          );
        }
      }

      const query = `SELECT * FROM CONTATOS LEFT JOIN USUARIOS ON CONTATOS.VENDEDOR_ID = USUARIOS.ID_USUARIO${conditions.length > 0 ? ` WHERE 1=1 AND ${conditions.join(" AND ")}` : ""}`;

      const results = await MySQLDB.query(query, params);
      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching contacts.",
      };
    }
  }

  static async saveEditedContact(contactData) {
    const { id, name, number, cnpj } = contactData;
    try {
      if (!id) {
        return {
          success: false,
          error: "Contact ID is required.",
        };
      }

      console.log(contactData);

      if (!name || !number || !cnpj) {
        return {
          success: false,
          error: "Name, cellphone number and CNPJ are required.",
        };
      }

      const query = `UPDATE CONTATOS SET CONTATO_NOME = ?, CONTATO_NUMERO = ?, CONTATO_CNPJ = ? WHERE CONTATO_ID = ?`;
      const params = [name.toUpperCase(), number, cnpj, id];

      await MySQLDB.query(query, params);
      return {
        success: true,
        message: "Contact updated successfully.",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while saving the contact.",
      };
    }
  }

  static async deleteContact(contactId) {
    try {
      if (!contactId) {
        return {
          success: false,
          error: "Contact ID is required.",
        };
      }

      const query = `DELETE FROM CONTATOS WHERE CONTATO_ID = ?`;
      const params = [contactId];

      await MySQLDB.query(query, params);
      return {
        success: true,
        message: "Contact deleted successfully.",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while deleting the contact.",
      };
    }
  }

  static async addContact(contactData) {
    const { name, number, cnpj, sellerId } = contactData;
    try {
      const query = `INSERT INTO CONTATOS (CONTATO_NOME, CONTATO_NUMERO, CONTATO_CNPJ, VENDEDOR_ID, CONTATO_RECEBER_MENSAGENS) VALUES (?, ?, ?, ?, ?)`;
      const params = [name.toUpperCase(), number, cnpj, sellerId, 1];

      await MySQLDB.query(query, params);
      return {
        success: true,
        message: "Contact added successfully.",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while adding the contact.",
      };
    }
  }

  static async getSession(userId) {
    try {
      const query = `SELECT * FROM KEYS_WHATSAPP WHERE VENDEDOR_ID = ?`;
      const params = [userId];
      const results = await MySQLDB.query(query, params);
      if (results.length > 0) {
        return results[0];
      } else {
        throw new Error("User not found.");
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching the session key.",
      };
    }
  }

  static async getSessionStatus(session) {
    try {
      const response = await axios.get(
        `${WppConnectConfig.apiUrl}/${session.SESSION}/status-session`,
        { headers: WppConnectConfig.buildHeaders(session.KEY_VALUE) },
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching the session status.",
      };
    }
  }

  static async checkWhatsappConnection(session) {
    try {
      const response = await axios.get(
        `${WppConnectConfig.apiUrl}/${session.SESSION}/check-connection-session`,
        {
          headers: WppConnectConfig.buildHeaders(session.KEY_VALUE),
          timeout: 10000,
        },
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while checking the WhatsApp connection.",
      };
    }
  }

  static async startSession(session) {
    try {
      console.log("Iniciando sessão...");

      const response = await axios.post(
        `${WppConnectConfig.apiUrl}/${session.SESSION}/start-session`,
        {
          webhook: "",
          waitQrCode: true,
        },
        { headers: WppConnectConfig.buildHeaders(session.KEY_VALUE) },
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.log("Error starting session:", error);

      return {
        success: false,
        error: error.message,
        message: "An error occurred while starting the session.",
      };
    }
  }
}

export default WhatsappService;
