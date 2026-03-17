import { ipcMain } from "electron";

// Controllers
import LoginController from "./src/controllers/LoginController.js";
import ProductController from "./src/controllers/ProductController.js";
import InvoiceController from "./src/controllers/InvoiceController.js";
import OrderController from "./src/controllers/OrderController.js";

ipcMain.handle("login", async (event, args) => {
  return await LoginController.login(args);
});

ipcMain.handle("validate-token", async (event, token) => {
  try {
    const isValid = await LoginController.validateToken(token);
    return isValid;
  } catch (error) {
    console.log(error);
    return false;
  }
});

ipcMain.handle("get-products", async (event, args) => {
  return await ProductController.getProducts(args.filters);
});

ipcMain.handle("get-invoices", async (event, args) => {
  return await InvoiceController.getInvoices(args.filters);
});

ipcMain.handle("get-order", async (event, args) => {
  return await OrderController.getOrder(args.orderId);
});
