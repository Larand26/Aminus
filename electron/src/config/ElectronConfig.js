import dotenv from "dotenv";

dotenv.config();

class ElectronConfig {
  constructor() {
    this.isDev = process.env.NODE_ENV === "development";
  }
}

export default new ElectronConfig();
