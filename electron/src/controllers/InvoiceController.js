import InvoiceService from "../services/InvoiceService.js";

class InvoiceController {
  static async getInvoices(filters) {
    try {
      return await InvoiceService.getInvoices(filters);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching invoices.",
      };
    }
  }
}

export default InvoiceController;
