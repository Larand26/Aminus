import loadEnv from "./loadEnv.js";

loadEnv();

class MongoConfig {
  constructor() {
    this.uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  }
}

export default new MongoConfig();
