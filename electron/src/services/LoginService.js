import MySQLDB from "../database/MySQLDB.js";

class LoginService {
  /**
   * Authenticate the user with the provided credentials.
   * @param {Object} params { username: string, password: string }
   * @returns {Promise<{ success: boolean, error?: string, message: string }>}
   */
  static async login(params) {
    const { username, password } = params;

    // Example login logic - replace with actual database query
    const user = await MySQLDB.query("SELECT * FROM USUARIOS WHERE NOME = ?", [
      username,
    ]);

    if (!user || user.length === 0) {
      return {
        success: false,
        error: "Invalid username or password.",
        message: "Invalid username or password.",
      };
    }

    // Example password verification - replace with actual password hashing
    if (user[0].SENHA !== password) {
      return {
        success: false,
        error: "Invalid username or password.",
        message: "Invalid username or password.",
      };
    }

    return {
      success: true,
      message: "Login successful.",
    };
  }
}

export default LoginService;
