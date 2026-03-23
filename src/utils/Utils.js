class Utils {
  static formatDateTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleString();
  }

  static formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  }

  static formatDateOutYear(value) {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
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

  static convertLocalFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}

export default Utils;
