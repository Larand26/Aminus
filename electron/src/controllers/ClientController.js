import ClientService from "../services/ClientService.js";

class ClientController {
  static async getClients(filters) {
    try {
      return await ClientService.getClients(filters);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching clients.",
      };
    }
  }
}

export default ClientController;
