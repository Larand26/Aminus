class Invoices {
  static async getInvoices(args) {
    const { token, filters } = args;
    try {
      return await window.api.getInvoices({ token, filters });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching invoices.",
      };
    }
  }
}
export default Invoices;
