import { ipcMain } from "electron";

// Controllers
import LoginController from "./src/controllers/LoginController.js";
import ProductsController from "./src/controllers/ProductsController.js";

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
  return await ProductsController.getProducts(args.filters);
});
