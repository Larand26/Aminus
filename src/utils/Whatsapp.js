class Whatsapp {
  static async getContacts(args) {
    const { token, filters } = args;
    try {
      return await window.api.getContacts({ token, filters });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching contacts.",
      };
    }
  }
}

export default Whatsapp;
