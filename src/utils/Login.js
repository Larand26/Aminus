class Login {
  static async login(args) {
    try {
      console.log(args);

      return await window.api.login(args);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred during login.",
      };
    }
  }
}
export default Login;
