const axios = require("axios");
const pegaData = async () => {
  try {
    const response = await axios.get(
      "https://timeapi.io/api/Time/current/zone?timeZone=UTC"
    );
    console.log("Pega Data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Pega data:", error.message);
    throw error;
  }
};
pegaData();
