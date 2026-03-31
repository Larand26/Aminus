import MySQLDB from "../database/MySQLDB.js";

const filtersToQuery = {
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
   * @param {Object<{cellphoneNumber: string, name: string, sellerId: string, sellerName: string}>} filters
   * @returns
   */
  static async getContacts(filters) {
    try {
      // Detectar tipo de DB
      const params = [];
      const queryConditions = Object.entries(filters)
        .filter(([_, value]) => !!value)
        .map(([key, value]) => {
          const filter = filtersToQuery[key];
          const paramValue = filter.transform ? filter.transform(value) : value;
          if (isMySQL) {
            params.push(paramValue);
          }
          return filter.condition;
        })
        .join(" AND ");

      const query = `SELECT * FROM CONTATOS LEFT JOIN USUARIOS ON CONTATOS.VENDEDOR_ID = USUARIOS.ID_USUARIO${queryConditions ? ` WHERE ${queryConditions}` : ""}`;
      console.log(query);

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
