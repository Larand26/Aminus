import loadEnv from "./loadEnv.js";

loadEnv();

class WppConnectConfig {
  constructor() {
    this.apiUrl = process.env.WPP_CONNECT_API_URL || "http://localhost:8000";
  }
  buildHeaders(token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
}
export default new WppConnectConfig();
