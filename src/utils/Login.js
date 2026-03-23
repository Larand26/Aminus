class Login {
  static async login(args) {
    try {
      return await window.api.login(args);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred during login.",
      };
    }
  }

  static async validateToken(token) {
    try {
      return await window.api.validateToken(token);
    } catch (error) {
      return false;
    }
  }
}
export default Login;
