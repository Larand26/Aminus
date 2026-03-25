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

  static bufferToBase64(buffer) {
    if (!buffer) return "";

    const uint8Array = new Uint8Array(buffer);
    let binaryString = "";

    // Em vez de .apply(), usamos um loop para construir a string
    // Isso evita o erro de "Maximum call stack size exceeded"
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }

    const base64String = btoa(binaryString);

    return `data:image/jpeg;base64,${base64String}`;
  }

  static base64ToBuffer(base64String) {
    const base64Data = base64String.split(",")[1];
    const binaryString = atob(base64Data);
    const buffer = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      buffer[i] = binaryString.charCodeAt(i);
    }
    return buffer;
  }

  static arePhotoArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
}

export default Utils;
