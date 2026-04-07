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
      console.error("Erro ao buscar data do servidor:", error);
      return new Date(); // fallback
    }
  }

  static getDifferenceInMinutes(date1, date2) {
    const diffInMs = Math.abs(date1 - date2);
    return Math.floor(diffInMs / (1000 * 60));
  }
}

export default Utils;
