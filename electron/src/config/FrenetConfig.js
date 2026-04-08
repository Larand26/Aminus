import loadEnv from "./loadEnv.js";

loadEnv();

class FrenetConfig {
  constructor() {
    this.apiKey = process.env.FRENET_API_KEY;
  }
}

export default new FrenetConfig();
