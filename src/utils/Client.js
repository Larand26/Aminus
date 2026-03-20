class Client {
  static async getClients(args) {
    const { token, filters } = args;
    try {
      return await window.api.getClients({ token, filters });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching clients.",
      };
    }
  }
}
export default Client;
