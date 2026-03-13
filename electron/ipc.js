import { ipcMain } from "electron";

// Controllers
import LoginController from "./src/controllers/LoginController.js";

ipcMain.handle("login", async (event, args) => {
  return await LoginController.login(args);
});
