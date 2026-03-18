import { ipcMain } from "electron";

// Controllers
import LoginController from "./src/controllers/LoginController.js";
import ProductController from "./src/controllers/ProductController.js";
import InvoiceController from "./src/controllers/InvoiceController.js";
import OrderController from "./src/controllers/OrderController.js";
import ClientController from "./src/controllers/ClientController.js";
import PhotoController from "./src/controllers/PhotoController.js";

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
