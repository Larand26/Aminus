class Utils {
  static formatDateTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleString();
  }

  static formatPasteValues(values) {
    if (!values || values.length === 0) return "";
    return values.join(" - ");
  }

  static formatCurrency(value) {
    if (value == null) return "";
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
}

export default Utils;
