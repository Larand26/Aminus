import MySQLDB from "../database/MySQLDB.js";

import WppConnectConfig from "../config/WppConnectConfig.js";
import Utils from "../utils/Utils.js";

import axios from "axios";

const filtersToQuery = {
  id: {
    condition: `CONTATOS.CONTATO_ID`,
    operator: "IN",
    transform: (value) => (Array.isArray(value) ? value : [value]),
  },
  cellphoneNumber: { condition: `CONTATOS.CONTATO_NUMERO = ?` },
  name: {
    condition: `CONTATOS.CONTATO_NOME LIKE ?`,
    transform: (v) => `%${v}%`,
  },
  sellerId: { condition: `CONTATOS.VENDEDOR_ID = ?` },
  sellerName: { condition: `USUARIOS.NOME LIKE ?` },
};

const hasFilterValue = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== null && value !== undefined && value !== "";
};

class WhatsappService {
  /**
   * Pega os contatos do banco de dados, filtrando por número de celular, nome do contato, id do vendedor ou nome do vendedor.
   * @param {Object<{id: Array<Number>, cellphoneNumber: string, name: string, sellerId: string, sellerName: string}>} filters
   * @returns
   */
  static async getContacts(filters) {
    try {
      // Detectar tipo de DB
      const params = [];
      const conditions = [];
      const queryConditions = Object.keys(filters);
      for (const key of queryConditions) {
        if (hasFilterValue(filters[key])) {
          const filterConfig = filtersToQuery[key];
          const filterValue = filterConfig.transform
            ? filterConfig.transform(filters[key])
            : filters[key];
          if (filterConfig.operator === "IN") {
            conditions.push(
              `${filterConfig.condition} IN (${filterValue.map(() => "?").join(", ")})`,
            );
            params.push(...filterValue);
            continue;
          }
          conditions.push(filterConfig.condition);
          params.push(filterValue);
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
    const url = `${WppConnectConfig.apiUrl}/${session.SESSION}/start-session`;
    const data = {
      webhook: "",
      waitQrCode: true,
    };
    const config = {
      headers: WppConnectConfig.buildHeaders(session.KEY_VALUE),
      timeout: 10000,
    };

    const callStartSession = () => axios.post(url, data, config);

    try {
      console.log("Iniciando sessão...");

      const response = await callStartSession();
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const isTimeout =
        error.code === "ECONNABORTED" ||
        String(error.message).toLowerCase().includes("timeout");

      if (!isTimeout) {
        console.log("Error starting session:", error);

        return {
          success: false,
          error: error.message,
          message: "An error occurred while starting the session.",
        };
      }

      try {
        console.log("Timeout no startSession, tentando novamente...");
        const response = await callStartSession();

        return {
          success: true,
          data: response.data,
        };
      } catch (retryError) {
        console.log("Error starting session after retry:", retryError);

        return {
          success: false,
          error: retryError.message,
          message: "An error occurred while starting the session.",
        };
      }
    }
  }

  static async closeSession(session) {
    try {
      const response = await axios.post(
        `${WppConnectConfig.apiUrl}/${session.SESSION}/close-session`,
        {},
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
        message: "An error occurred while closing the session.",
      };
    }
  }

  static async sendPhotos({ contacts, photos, session }) {
    try {
      const responseData = [];
      let errors = 0;
      for (const contact of contacts) {
        for (const photo of photos) {
          const body = {
            phone: contact.CONTATO_NUMERO,
            isGroup: false,
            isNewsletter: false,
            isLid: false,
            message: "",
            fileName: "foto.jpg",
            caption: "",
            base64: photo,
          };

          try {
            await axios.post(
              `${WppConnectConfig.apiUrl}/${session.SESSION}/send-image`,
              body,
              {
                headers: WppConnectConfig.buildHeaders(session.KEY_VALUE),
              },
            );

            responseData.push({
              contact: contact.CONTATO_NUMERO,
              success: true,
            });
            await new Promise((resolve) =>
              setTimeout(resolve, Utils.setRamdomTime(800, 2500)),
            );
          } catch (error) {
            // Se ocorrerem 3 erros consecutivos, verificar se a sessão ainda está ativa antes de continuar a enviar mensagens para os próximos contatos
            if (errors >= 3) {
              const connectionStatus =
                await WhatsappService.checkWhatsappConnection(session);
              if (!connectionStatus?.data?.status) {
                return {
                  success: false,
                  error: "WhatsApp session is not connected.",
                  message:
                    "The WhatsApp session appears to be disconnected. Please check the connection and try again.",
                };
              }
              errors = 0; // Resetar contador de erros após verificar a conexão
            }
            responseData.push({
              contact: contact.CONTATO_NUMERO,
              success: false,
              error: error.message,
            });
            errors++;
            // Continua para o próximo contato mesmo se houver erro
            continue;
          }
        }
      }
      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while sending messages.",
      };
    }
  }

  static async sendMessage({ contacts, message, session }) {
    try {
      const responseData = [];
      let errors = 0;
      for (const contact of contacts) {
        const body = {
          phone: contact.CONTATO_NUMERO,
          isGroup: false,
          isNewsletter: false,
          isLid: false,
          message: message,
        };

        try {
          await axios.post(
            `${WppConnectConfig.apiUrl}/${session.SESSION}/send-message`,
            body,
            {
              headers: WppConnectConfig.buildHeaders(session.KEY_VALUE),
            },
          );
          responseData.push({
            contact: contact.CONTATO_NUMERO,
            success: true,
          });
          await new Promise((resolve) =>
            setTimeout(resolve, Utils.setRamdomTime(800, 2500)),
          );
        } catch (error) {
          // Se ocorrerem 3 erros consecutivos, verificar se a sessão ainda está ativa antes de continuar a enviar mensagens para os próximos contatos
          if (errors >= 3) {
            const connectionStatus =
              await WhatsappService.checkWhatsappConnection(session);
            if (!connectionStatus?.data?.status) {
              return {
                success: false,
                error: "WhatsApp session is not connected.",
                message:
                  "The WhatsApp session appears to be disconnected. Please check the connection and try again.",
              };
            }
            errors = 0; // Resetar contador de erros após verificar a conexão
          }
          responseData.push({
            contact: contact.CONTATO_NUMERO,
            success: false,
            error: error.message,
          });
          errors++;
          continue;
        }
      }
      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while sending messages.",
      };
    }
  }

  static async checkLastMessageTime(session) {
    try {
      const today = await Utils.getCurrentDateFromServer();
      const lastMessageTime = session.ULTIMA_MENSAGEM;

      if (lastMessageTime) {
        const diffInMinutes = Utils.getDifferenceInMinutes(
          today,
          new Date(lastMessageTime),
        );
        return diffInMinutes;
      }
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  static async updateLastMessageTime(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          error: "User ID is required.",
        };
      }
      const query = `UPDATE KEYS_WHATSAPP SET ULTIMA_MENSAGEM = ? WHERE VENDEDOR_ID = ?`;
      const params = [await Utils.getCurrentDateFromServer(), userId];

      await MySQLDB.query(query, params);
      return {
        success: true,
        message: "Last message time updated successfully.",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while updating the last message time.",
      };
    }
  }
}

export default WhatsappService;
