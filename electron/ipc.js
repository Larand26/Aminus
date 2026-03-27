import { ipcMain, shell } from "electron";

// Controllers
import LoginController from "./src/controllers/LoginController.js";
import ProductController from "./src/controllers/ProductController.js";
import InvoiceController from "./src/controllers/InvoiceController.js";
import OrderController from "./src/controllers/OrderController.js";
import ClientController from "./src/controllers/ClientController.js";
import PhotoController from "./src/controllers/PhotoController.js";
import FrenetController from "./src/controllers/FrenetController.js";

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

ipcMain.handle("get-product-reservations", async (event, args) => {
  return await ProductController.getProductReservations(args.filters);
});

ipcMain.handle("get-date-reservation", async (event, args) => {
  return await ProductController.getDateReservation(args.filters);
});

ipcMain.handle("get-product-registrations", async (event, args) => {
  return await ProductController.getProductRegistrations(args.filters);
});

ipcMain.handle("get-invoices", async (event, args) => {
  return await InvoiceController.getInvoices(args.filters);
});

ipcMain.handle("get-orders", async (event, args) => {
  return await OrderController.getOrders(args.filters);
});

ipcMain.handle("get-order-items", async (event, args) => {
  return await OrderController.getOrderItems(args.orderId);
});

ipcMain.handle("get-clients", async (event, args) => {
  return await ClientController.getClients(args.filters);
});

ipcMain.handle("get-photos", async (event, args) => {
  return await PhotoController.getPhotosProduct(args.filters);
});

ipcMain.handle("update-photo", async (event, args) => {
  return await PhotoController.updatePhoto(args);
});

ipcMain.handle("create-photo", async (event, args) => {
  return await PhotoController.createPhoto(args);
});

ipcMain.handle("calculate-freight", async (event, args) => {
  return await FrenetController.calculateFreight(args);
});

ipcMain.handle("generate-cubage-pdf", async (event, args) => {
  return await OrderController.generateCubagePDF(args.selectedOrderData);
});

ipcMain.handle("open-file", async (event, filePath) => {
  try {
    const result = await shell.openPath(filePath);
    if (result) {
      return { success: false, error: result };
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("download-photo", async (event, args) => {
  return await PhotoController.downloadPhoto(args);
});

ipcMain.handle("get-colors", async (event, args) => {
  return await ProductController.getColors(args.filters);
});

ipcMain.handle("create-color", async (event, args) => {
  return await ProductController.createColor(args);
});
