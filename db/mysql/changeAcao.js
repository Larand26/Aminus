const connectMySql = require("../../config/databaseMySql");

const changeAcao = async (arg) => {
  try {
    const connection = await connectMySql();
    const { acao, id } = arg;

    // Prepare the SQL query to update the action
    const updateQuery = `
      UPDATE controle_plaza
      SET ACAO = ?
      WHERE ID = ?
    `;

    // Execute the query with the provided action and ID
    const [result] = await connection.query(updateQuery, [acao + 1, id]);

    // Close the database connection
    await connection.end();

    // Return the result of the update operation
    return result;
  } catch (error) {
    console.error("Error changing action:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

module.exports = { changeAcao };
