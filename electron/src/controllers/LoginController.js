import LoginService from "../services/LoginService.js";

class LoginController {
  static async login(args) {
    const { username, password } = args;

    if (!username || !password) {
      return {
        success: false,
        message: "Username and password are required.",
      };
    }

    try {
      return await LoginService.login({ username, password });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred during login.",
      };
    }
  }
}

export default LoginController;
