import { Buffer } from "buffer";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, "../assets");

/** Pares por caixa: o peso do ERP é por par e a cubagem é por caixa. */
export const PARES_POR_CAIXA = 12;

/** Dimensões (cm) usadas quando o produto não tem medida cadastrada. */
const DIMENSOES_PADRAO = { altura: 20, largura: 30, comprimento: 45 };

// Identidade do Aminus (mesmas cores de src/index.css)
const COR = {
  primaria: [44, 62, 78], // #2c3e4e
  fundo: [232, 237, 235], // #e8edeb
  texto: [28, 28, 28], // #1c1c1c
  selecionado: [101, 136, 132], // #658884
  amarelo: [223, 159, 78], // #df9f4e
  vermelho: [178, 71, 62], // #b2473e
  branco: [255, 255, 255],
  linhaAlternada: [244, 247, 246],
  textoSuave: [110, 122, 130],
};

const FONTES = [
  { arquivo: "Inter_18pt-Regular.ttf", familia: "Inter", estilo: "normal" },
  { arquivo: "Inter_18pt-Bold.ttf", familia: "Inter", estilo: "bold" },
  { arquivo: "BebasNeue-Regular.ttf", familia: "BebasNeue", estilo: "normal" },
];

let fontCache = null;
let logoCache = null;

const loadFonts = () => {
  if (!fontCache) {
    fontCache = FONTES.map((f) => ({
      ...f,
      base64: readFileSync(path.join(ASSETS_DIR, "fonts", f.arquivo)).toString(
        "base64",
      ),
    }));
  }
  return fontCache;
};

const loadLogo = () => {
  if (!logoCache) {
    logoCache = readFileSync(path.join(ASSETS_DIR, "img", "imagologo.png"));
  }
  return logoCache;
};

const parseNumber = (value, fallback = 0) => {
  const normalized = typeof value === "string" ? value.replace(",", ".") : value;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const fmt = (value, decimals = 2) =>
  Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const fmtInt = (value) =>
  Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 2 });

/**
 * @typedef {Object} CubageItem
 * @property {string} COD_FABRICANTE
 * @property {string} [DESCRICAO]
 * @property {number} quantidade      pares
 * @property {number} caixas          quantidade / PARES_POR_CAIXA
 * @property {number} altura          cm
 * @property {number} largura         cm
 * @property {number} comprimento     cm
 * @property {boolean} dimensaoPadrao true se alguma medida veio vazia
 * @property {number} pesoCaixa       kg (peso bruto do par × 12)
 * @property {number} volumeTotal     m³
 * @property {number} pesoTotal       kg
 */

/**
 * Calcula volume e peso de cada item do pedido.
 * @param {Array<Object>} itens linhas de queryItemsOrder.sql
 * @returns {CubageItem[]}
 */
export const calculateCubage = (itens) =>
  itens.map((item) => {
    const quantidade = parseNumber(item.QUANTIDADE, 0);
    const pesoPar = parseNumber(item.PESO_BRUTO, 0);

    const medida = (valor, padrao) => {
      const n = parseNumber(valor, 0);
      return n === 0 ? { v: padrao, padrao: true } : { v: n, padrao: false };
    };
    const altura = medida(item.ALTURA, DIMENSOES_PADRAO.altura);
    const largura = medida(item.LARGURA, DIMENSOES_PADRAO.largura);
    const comprimento = medida(item.COMPRIMENTO, DIMENSOES_PADRAO.comprimento);

    const caixas = quantidade / PARES_POR_CAIXA;
    const volumeCaixa =
      (altura.v / 100) * (largura.v / 100) * (comprimento.v / 100);
    const pesoCaixa = pesoPar * PARES_POR_CAIXA;

    return {
      COD_FABRICANTE: item.COD_FABRICANTE ?? "",
      DESCRICAO: item.DESCRICAO ?? "",
      quantidade,
      caixas,
      altura: altura.v,
      largura: largura.v,
      comprimento: comprimento.v,
      dimensaoPadrao: altura.padrao || largura.padrao || comprimento.padrao,
      pesoCaixa,
      volumeTotal: volumeCaixa * caixas,
      pesoTotal: pesoCaixa * caixas,
    };
  });

/**
 * Monta o PDF de cubagem com a identidade visual do Aminus.
 * @param {Array<Object>} itens linhas de queryItemsOrder.sql
 * @param {Object|null} [pedido] linha de queryOrder.sql (opcional, vai para o cabeçalho)
 * @returns {Buffer}
 */
export const buildCubagePDF = (itens, pedido = null) => {
  const items = calculateCubage(itens);
  const totais = items.reduce(
    (acc, i) => ({
      pares: acc.pares + i.quantidade,
      caixas: acc.caixas + i.caixas,
      volume: acc.volume + i.volumeTotal,
      peso: acc.peso + i.pesoTotal,
    }),
    { pares: 0, caixas: 0, volume: 0, peso: 0 },
  );

  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  for (const f of loadFonts()) {
    pdf.addFileToVFS(f.arquivo, f.base64);
    pdf.addFont(f.arquivo, f.familia, f.estilo);
  }

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const M = 14; // margem lateral
  const contentW = pageW - M * 2;

  // ── Cabeçalho ─────────────────────────────────────────────
  const headerH = 30;
  pdf.setFillColor(...COR.primaria);
  pdf.rect(0, 0, pageW, headerH, "F");
  pdf.setFillColor(...COR.selecionado);
  pdf.rect(0, headerH, pageW, 1.6, "F");

  const logoH = 13;
  const logoW = logoH * (1636 / 454);
  pdf.addImage(loadLogo(), "PNG", M, (headerH - logoH) / 2, logoW, logoH);

  pdf.setTextColor(...COR.branco);
  pdf.setFont("BebasNeue", "normal");
  pdf.setFontSize(24);
  pdf.text("RELATÓRIO DE CUBAGEM", pageW - M, 15.5, { align: "right" });

  const now = new Date();
  pdf.setFont("Inter", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...COR.fundo);
  pdf.text(
    `Gerado em ${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
    pageW - M,
    21.5,
    { align: "right" },
  );

  let y = headerH + 8;

  // ── Dados do pedido ───────────────────────────────────────
  if (pedido) {
    const campos = [
      ["PEDIDO", pedido.NUM_PEDIDO],
      ["CLIENTE", pedido.RAZAO_SOCIAL],
      ["TRANSPORTADORA", pedido.NOME_TRANSPORTADORA],
      ["VENDEDOR", pedido.NOME_VENDEDOR],
    ].filter(([, v]) => v != null && String(v).trim() !== "");

    if (campos.length > 0) {
      const larguras = { PEDIDO: 0.14, CLIENTE: 0.44, TRANSPORTADORA: 0.22, VENDEDOR: 0.2 };
      const soma = campos.reduce((s, [k]) => s + larguras[k], 0);
      const boxH = 15;
      pdf.setFillColor(...COR.fundo);
      pdf.roundedRect(M, y, contentW, boxH, 2, 2, "F");

      let x = M + 5;
      for (const [rotulo, valor] of campos) {
        const w = (larguras[rotulo] / soma) * (contentW - 10);
        pdf.setFont("Inter", "bold");
        pdf.setFontSize(6.5);
        pdf.setTextColor(...COR.selecionado);
        pdf.text(rotulo, x, y + 5.5);
        pdf.setFont("Inter", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...COR.texto);
        const texto = pdf.splitTextToSize(String(valor).trim(), w - 4)[0];
        pdf.text(texto, x, y + 11);
        x += w;
      }
      y += boxH + 6;
    }
  }

  // ── Indicadores ───────────────────────────────────────────
  const kpis = [
    { rotulo: "PARES", valor: fmtInt(totais.pares), un: "" },
    { rotulo: "CAIXAS", valor: fmtInt(totais.caixas), un: `${PARES_POR_CAIXA} pares/cx` },
    { rotulo: "VOLUME TOTAL", valor: fmt(totais.volume, 4), un: "m³" },
    { rotulo: "PESO TOTAL", valor: fmt(totais.peso, 2), un: "kg", destaque: true },
  ];
  const gap = 4;
  const kpiW = (contentW - gap * (kpis.length - 1)) / kpis.length;
  const kpiH = 20;
  kpis.forEach((k, i) => {
    const x = M + i * (kpiW + gap);
    pdf.setFillColor(...(k.destaque ? COR.primaria : COR.branco));
    pdf.setDrawColor(...(k.destaque ? COR.primaria : COR.fundo));
    pdf.setLineWidth(0.4);
    pdf.roundedRect(x, y, kpiW, kpiH, 2, 2, "FD");
    pdf.setFillColor(...(k.destaque ? COR.amarelo : COR.selecionado));
    pdf.rect(x, y + 4, 1.2, kpiH - 8, "F");

    pdf.setFont("Inter", "bold");
    pdf.setFontSize(6.5);
    pdf.setTextColor(...(k.destaque ? COR.fundo : COR.textoSuave));
    pdf.text(k.rotulo, x + 5, y + 6.5);

    pdf.setFont("BebasNeue", "normal");
    pdf.setFontSize(20);
    pdf.setTextColor(...(k.destaque ? COR.branco : COR.primaria));
    pdf.text(k.valor, x + 5, y + 15.5);
    if (k.un) {
      const vw = pdf.getTextWidth(k.valor);
      pdf.setFont("Inter", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(...(k.destaque ? COR.fundo : COR.textoSuave));
      pdf.text(k.un, x + 5 + vw + 1.5, y + 15.5);
    }
  });
  y += kpiH + 8;

  // ── Tabela ────────────────────────────────────────────────
  const temPadrao = items.some((i) => i.dimensaoPadrao);
  const body = items.map((i) => [
    i.COD_FABRICANTE,
    i.DESCRICAO,
    fmtInt(i.quantidade),
    fmtInt(i.caixas),
    `${fmtInt(i.altura)} × ${fmtInt(i.largura)} × ${fmtInt(i.comprimento)}${i.dimensaoPadrao ? " *" : ""}`,
    fmt(i.pesoCaixa, 2),
    fmt(i.volumeTotal, 4),
    fmt(i.pesoTotal, 2),
  ]);

  autoTable(pdf, {
    startY: y,
    margin: { left: M, right: M, top: 16, bottom: 18 },
    head: [
      [
        "REFERÊNCIA",
        "DESCRIÇÃO",
        "PARES",
        "CAIXAS",
        "A × L × C (cm)",
        "PESO/CX (kg)",
        "VOL. (m³)",
        "PESO (kg)",
      ],
    ],
    body,
    foot: [
      [
        { content: "TOTAL", colSpan: 2 },
        fmtInt(totais.pares),
        fmtInt(totais.caixas),
        "",
        "",
        fmt(totais.volume, 4),
        fmt(totais.peso, 2),
      ],
    ],
    showFoot: "lastPage",
    theme: "plain",
    styles: {
      font: "Inter",
      fontSize: 8,
      textColor: COR.texto,
      cellPadding: { top: 2.6, bottom: 2.6, left: 2.5, right: 2.5 },
      valign: "middle",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: COR.primaria,
      textColor: COR.branco,
      fontStyle: "bold",
      fontSize: 7,
      halign: "center",
      cellPadding: { top: 3.2, bottom: 3.2, left: 2.5, right: 2.5 },
    },
    footStyles: {
      fillColor: COR.fundo,
      textColor: COR.primaria,
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "right",
    },
    alternateRowStyles: { fillColor: COR.linhaAlternada },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 22, halign: "left" },
      1: { cellWidth: "auto", halign: "left" },
      2: { cellWidth: 14, halign: "right" },
      3: { cellWidth: 15, halign: "right" },
      4: { cellWidth: 26, halign: "center" },
      5: { cellWidth: 21, halign: "right" },
      6: { cellWidth: 17, halign: "right" },
      7: { cellWidth: 18, halign: "right", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      if (data.section === "head" && data.column.index === 1) {
        data.cell.styles.halign = "left";
      }
      if (data.section === "head" && data.column.index === 0) {
        data.cell.styles.halign = "left";
      }
      if (data.section === "foot" && data.column.index === 0) {
        data.cell.styles.halign = "left";
      }
      // coluna de peso total em destaque
      if (data.column.index === 7 && data.section === "body") {
        data.cell.styles.textColor = COR.primaria;
      }
    },
    didDrawCell: (data) => {
      if (data.section === "body") {
        pdf.setDrawColor(...COR.fundo);
        pdf.setLineWidth(0.2);
        const { x, y: cy, width, height } = data.cell;
        pdf.line(x, cy + height, x + width, cy + height);
      }
    },
  });

  let endY = pdf.lastAutoTable.finalY + 5;
  if (temPadrao) {
    if (endY > pageH - 24) {
      pdf.addPage();
      endY = 20;
    }
    pdf.setFont("Inter", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(...COR.textoSuave);
    pdf.text(
      `* Produto sem medida cadastrada: usada a caixa padrão de ${DIMENSOES_PADRAO.altura} × ${DIMENSOES_PADRAO.largura} × ${DIMENSOES_PADRAO.comprimento} cm.`,
      M,
      endY,
    );
  }

  // ── Rodapé em todas as páginas ────────────────────────────
  const totalPages = pdf.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    pdf.setDrawColor(...COR.fundo);
    pdf.setLineWidth(0.4);
    pdf.line(M, pageH - 12, pageW - M, pageH - 12);
    pdf.setFont("Inter", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(...COR.textoSuave);
    const ref = pedido?.NUM_PEDIDO ? ` · Pedido ${pedido.NUM_PEDIDO}` : "";
    pdf.text(`Aminus · Relatório de cubagem${ref}`, M, pageH - 7);
    pdf.text(`Página ${p} de ${totalPages}`, pageW - M, pageH - 7, {
      align: "right",
    });
  }

  return Buffer.from(pdf.output("arraybuffer"));
};
