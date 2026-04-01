import MySQLDB from "../database/MySQLDB.js";

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

      console.log(query, params);

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
}

export default WhatsappService;
