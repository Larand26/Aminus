import { jsPDF } from "jspdf";

export default (data) => {
  const doc = new jsPDF();
  doc.text("Título do PDF", 10, 10);
  doc.text(JSON.stringify(data), 10, 20);

  // Faz o download automático no navegador
  doc.save("documento.pdf");
};
