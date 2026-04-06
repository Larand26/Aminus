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

  static async saveEditedContact(args) {
    const { token, contactData } = args;
    try {
      return await window.api.saveEditedContact({ token, contactData });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while saving the contact.",
      };
    }
  }

  static async deleteContact(args) {
    const { token, contactId } = args;
    try {
      return await window.api.deleteContact({ token, contactId });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while deleting the contact.",
      };
    }
  }

  static async addContact(args) {
    const { token, contactData } = args;
    try {
      return await window.api.addContact({ token, contactData });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while adding the contact.",
      };
    }
  }

  static async startSession(args) {
    const { token } = args;
    try {
      return await window.api.startSession({ token });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while starting the session.",
      };
    }
  }

  static async closeSession(args) {
    const { token } = args;
    try {
      return await window.api.closeSession({ token });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while generating the QR code.",
      };
    }
  }
}

export default Whatsapp;
