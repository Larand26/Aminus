import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/img/png/logo-daniel-branco.png"; // ajuste o caminho se necessário

export default (data, cubagem) => {
  const doc = new jsPDF();

  // Fundo vermelho para a logo
  doc.setFillColor(241, 96, 100); // cor #f16064
  doc.rect(0, 0, 210, 30, "F"); // largura A4 = 210mm, altura do topo = 30mm

  // Centraliza a logo
  const logoWidth = 50;
  const logoHeight = 20;
  const pageWidth = 210;
  const logoX = (pageWidth - logoWidth) / 2; // centralizado
  doc.addImage(logo, "PNG", logoX, 5, logoWidth, logoHeight);

  autoTable(doc, {
    head: [
      [
        "Código de fabricante",
        "Altura",
        "Largura",
        "Comprimento",
        "Quantidade",
      ],
    ],
    body: data.map((item) => [
      item.PROD_CODFABRIC,
      (item.PROD_ALTURA / 100).toFixed(2) + " m",
      (item.PROD_LARGURA / 100).toFixed(2) + " m",
      (item.PROD_COMPRIMENTO / 100).toFixed(2) + " m",
      item.ITPEDOR_QUANTID,
    ]),
    startY: 35,
    styles: {
      halign: "center",
      fontSize: 10,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [241, 96, 100],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [224, 224, 224],
    },
    rowPageBreak: "avoid",
  });

  // Centraliza a cubagem e coloca fundo vermelho
  const cubagemText = `Cubagem total: ${cubagem.toFixed(2)} m³`;
  const fontSize = 14;
  doc.setFontSize(fontSize);
  const textWidth = doc.getTextWidth(cubagemText);
  const x = (pageWidth - textWidth) / 2;
  const y = doc.lastAutoTable.finalY + 20;
  const paddingX = 6;
  const paddingY = 3;

  // Fundo vermelho
  doc.setFillColor(241, 96, 100);
  doc.rect(
    x - paddingX,
    y - fontSize + paddingY,
    textWidth + paddingX * 2,
    fontSize + paddingY * 2,
    "F"
  );

  // Texto centralizado em branco
  doc.setTextColor(255, 255, 255);
  doc.text(cubagemText, x, y);

  doc.save(data[0].ID_NUMPEDORC + ".pdf");
};
