import LoginService from "../services/LoginService.js";
import JwtService from "../services/JwtService.js";

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
      const loginResult = await LoginService.login({ username, password });
      if (!loginResult.success) {
        return {
          success: false,
          error: loginResult.error,
          message: loginResult.message,
        };
      }

      const token = await JwtService.generateToken(loginResult.user);

      return {
        success: true,
        token,
        message: loginResult.message,
        user: {
          id: loginResult.user.ID_USUARIO,
          username: loginResult.user.NOME,
          roleId: loginResult.user.ID_FUNCAO_USUARIO,
          role: loginResult.user.DESCRICAO,
        },
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        error: error.message,
        message: "An error occurred during login.",
      };
    }
  }
}

export default LoginController;
