import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import SQLServerDB from "../database/SQLServerDB.js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_QUERY = readFileSync(
  path.resolve(__dirname, "../database/queries/queryOrder.sql"),
  "utf-8",
);
const ITEMS_BASE_QUERY = readFileSync(
  path.resolve(__dirname, "../database/queries/queryItemsOrder.sql"),
  "utf-8",
);
const FILTER_PLACEHOLDER = "-- Os filtros serão adicionados aqui pelo Node.js";

const FILTER_MAP = {
  numOrder: { condition: `PO.[ID_NUMPEDORC] = @numOrder` },
  cnpj: { condition: `E.[ENTI_CNPJCPF] = @cnpj` },
  client: {
    condition: `E.[ENTI_RAZAOSOCIAL] LIKE @client`,
    transform: (v) => `%${v}%`,
  },
  initialDate: {
    condition: `CONVERT(date, PO.[PEDOR_DATA]) >= CONVERT(date, @initialDate)`,
  },
  finalDate: {
    condition: `CONVERT(date, PO.[PEDOR_DATA]) <= CONVERT(date, @finalDate)`,
  },
  sellerId: { condition: `PO.[ID_CODVENDEDOR] = @sellerId` },
  transportadora: { condition: `PO.[ID_TRANSPORTADORA] = @transportadora` },
  status: { condition: `PO.[PEDOR_SITUACAO] = @status` },
};

const hasFilterValue = (value) => {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
};

class OrderService {
  /**
   * Pega os pedidos com base nos filtros fornecidos
   * @param {Object} filters { numOrder String, cnpj String, client String, initialDate Date, finalDate Date, sellerId Number, status String }
   * @returns {Promise<Array|Object>} Array of orders or error object
   */
  static async getOrders(filters = {}) {
    try {
      const safeFilters = filters && typeof filters === "object" ? filters : {};
      const params = [];
      const extraConditions = [];

      for (const [key, { condition, transform }] of Object.entries(
        FILTER_MAP,
      )) {
        if (!hasFilterValue(safeFilters[key])) continue;

        params.push({
          name: key,
          value: transform ? transform(safeFilters[key]) : safeFilters[key],
        });
        extraConditions.push(condition);
      }

      const suffix =
        extraConditions.length > 0
          ? `AND ${extraConditions.join(" AND ")}`
          : "";

      const query = BASE_QUERY.replace(FILTER_PLACEHOLDER, suffix);

      const orders = await SQLServerDB.query(query, params);

      return {
        success: true,
        data: orders,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching orders.",
      };
    }
  }

  /**
   * Pega os itens de um pedido específico
   * @param {Number} orderId
   * @returns {Promise<Array|Object>} Array of order items or error object
   */
  static async getOrderItems(orderId) {
    try {
      const isValidOrderId =
        orderId !== null &&
        orderId !== undefined &&
        String(orderId).trim() !== "";

      if (!isValidOrderId) {
        return {
          success: false,
          error: "Invalid order id.",
          message: "An order id is required to fetch order items.",
        };
      }

      const query = ITEMS_BASE_QUERY.replace(
        FILTER_PLACEHOLDER,
        "AND IPO.[ID_NUMPEDORC] = @orderId",
      );

      const items = await SQLServerDB.query(query, [
        { name: "orderId", value: orderId },
      ]);

      return {
        success: true,
        data: items,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching order items.",
      };
    }
  }

  /**
   * Gera um PDF com tabela de cubagem dos itens do pedido
   * @param {Object} args { selectedOrderData: Array }
   * @returns {Promise<Object>} { success: boolean, data: { filePath: string } ou error }
   */
  static async generateCubagePDF(itens) {
    try {
      if (!Array.isArray(itens) || itens.length === 0) {
        return {
          success: false,
          error: "No order items provided.",
          message:
            "At least one order item is required to generate cubage PDF.",
        };
      }

      const calculatedItems = itens.map((item) => {
        const {
          COD_FABRICANTE,
          QUANTIDADE,
          ALTURA,
          LARGURA,
          COMPRIMENTO,
          PESO_BRUTO,
        } = item;

        const parseNumber = (value, fallback = 0) => {
          const normalized =
            typeof value === "string" ? value.replace(",", ".") : value;
          const parsed = Number(normalized);
          return Number.isFinite(parsed) ? parsed : fallback;
        };

        const quantidadeFinal = parseNumber(QUANTIDADE, 0);
        const pesoFinal = parseNumber(PESO_BRUTO, 0);

        const alturaRaw = parseNumber(ALTURA, 20);
        const larguraRaw = parseNumber(LARGURA, 30);
        const comprimentoRaw = parseNumber(COMPRIMENTO, 45);

        const alturaFinal = alturaRaw === 0 ? 20 : alturaRaw;
        const larguraFinal = larguraRaw === 0 ? 30 : larguraRaw;
        const comprimentoFinal = comprimentoRaw === 0 ? 45 : comprimentoRaw;

        const volume =
          (alturaFinal / 100) * (larguraFinal / 100) * (comprimentoFinal / 100);
        const totalVolume = volume * (quantidadeFinal / 12);
        const totalWeight = (pesoFinal / 12) * quantidadeFinal;

        return {
          COD_FABRICANTE,
          QUANTIDADE: quantidadeFinal,
          ALTURA: alturaFinal,
          LARGURA: larguraFinal,
          COMPRIMENTO: comprimentoFinal,
          PESO_BRUTO: pesoFinal.toFixed(2),
          totalVolume: totalVolume.toFixed(4),
          totalWeight: totalWeight.toFixed(2),
        };
      });

      // Calcular totais
      const grandTotalVolume = calculatedItems.reduce(
        (sum, item) => sum + parseFloat(item.totalVolume),
        0,
      );
      const grandTotalWeight = calculatedItems.reduce(
        (sum, item) => sum + parseFloat(item.totalWeight),
        0,
      );

      // Criar PDF
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Título
      pdf.setFontSize(16);
      pdf.text("Relatório de Cubagem", pageWidth / 2, 20, { align: "center" });

      // Data
      pdf.setFontSize(10);
      const now = new Date();
      pdf.text(
        `Gerado em: ${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR")}`,
        pageWidth / 2,
        28,
        { align: "center" },
      );

      // Tabela
      const tableData = calculatedItems.map((item) => [
        item.COD_FABRICANTE,
        item.QUANTIDADE,
        item.ALTURA,
        item.LARGURA,
        item.COMPRIMENTO,
        item.PESO_BRUTO,
      ]);

      autoTable(pdf, {
        startY: 35,
        head: [
          [
            "COD_FABRICANTE",
            "QUANTIDADE",
            "ALTURA",
            "LARGURA",
            "COMPRIMENTO",
            "PESO_BRUTO",
          ],
        ],
        body: tableData,
        columnStyles: {
          0: { halign: "center" },
          1: { halign: "center" },
          2: { halign: "center" },
          3: { halign: "center" },
          4: { halign: "center" },
          5: { halign: "center" },
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: { textColor: 0 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      // Adicionar totais
      const finalY = pdf.lastAutoTable.finalY + 10;
      pdf.setFontSize(11);
      pdf.setFont(undefined, "bold");
      pdf.text(`Volume Total: ${grandTotalVolume.toFixed(4)} m³`, 20, finalY);
      pdf.text(`Peso Total: ${grandTotalWeight.toFixed(2)} kg`, 20, finalY + 8);

      // Salvar arquivo
      const fileName = `cubagem_${Date.now()}.pdf`;
      const filePath = path.resolve(__dirname, `../../.build/${fileName}`);

      // Garantir que o diretório existe
      const dir = path.dirname(filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
      writeFileSync(filePath, pdfBuffer);

      return {
        success: true,
        data: {
          filePath,
          fileName,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "An error occurred while generating the cubage PDF.",
      };
    }
  }
}

export default OrderService;
