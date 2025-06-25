const connectMySql = require("./databaseMySql");

const changeDataRepasse = async (id) => {
  try {
    const connection = await connectMySql();

    // Prepare the SQL query to update the action
    const updateQuery = `
      UPDATE controle_plaza
      SET DATA_REPASSE = ?
      WHERE ID = ?
    `;
    const data = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Execute the query with the provided action and ID
    const [result] = await connection.query(updateQuery, [data, id]);
    console.log(
      "Data de repasse alterada com sucesso: " + id + " - " + data,
      result
    );

    // Close the database connection
    await connection.end();

    // Return the result of the update operation
    return result;
  } catch (error) {
    console.error("Error changing action:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

module.exports = { changeDataRepasse };
