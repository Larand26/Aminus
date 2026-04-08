import axios from "axios";

class Utils {
  static setRamdomTime(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static async getCurrentDateFromServer() {
    try {
      const response = await axios.get(
        "https://worldtimeapi.org/api/timezone/America/Sao_Paulo",
      );
      return new Date(response.data.datetime);
    } catch (error) {
      return new Date(); // fallback
    }
  }

  static getDifferenceInSeconds(date1, date2) {
    const diffInMs = date1 - date2;
    return Math.floor(diffInMs / 1000);
  }

  static base64ToBuffer(base64) {
    const base64Data = base64.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      "",
    );
    return Buffer.from(base64Data, "base64");
  }
}

export default Utils;
