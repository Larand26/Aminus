import loadEnv from "./loadEnv.js";

loadEnv();

class ElectronConfig {
  constructor() {
    this.isDev = process.env.NODE_ENV === "development";
  }
}

export default new ElectronConfig();
