import Utils from "./Utils";

class Formatter {
  static wordsToRemove = [
    "CHINELO",
    "FEMININO",
    "MASCULINO",
    "INFANTIL",
    "BABY",
    "UNISEX",
    "CHINELO",
    "SANDALIA",
    "SANDÁLIA",
    "SLIDE",
    "GASPEA",
    "GÁSPEA",
    "TAMANCO",
    "BOTA",
    "GALOCHA",
    "SAPATILHA",
    "TENIS",
    "SAND",
    "CHIN",
    "RAST",
    "TAM",
    "INF",
    "PROMO",
    "MASC",
    "FEM",
    "AD",
    "ADULTO",
    "DEDO",
  ];

  static wordsToSubstitute = {
    "CHINELO DEDO": "CHINELO",
    "CHINELO SLIDE/GÁSPEA": "CHINELO SLIDE",
    RASTEIRINHAS: "RASTEIRA",
    SANDÁLIA: "SANDALIA",
    BABUCH: "BABUCHE",
  };

  static extractColor(description) {
    if (!description) return null;
    // pega texto entre } e (
    const colorMatch = description.match(/}\s*([^()]+)\s*\(/);
    if (colorMatch && colorMatch[1]) {
      return colorMatch[1].trim();
    }
  }

  static formatProductData(data) {
    const {
      GRUPO_DESCRICAO,
      ECOMMERCE_DESCRICAO,
      NUMEROS,
      QUANTIDADES,
      PROD_DESCRICAO,
      COD_FABRICANTE,
    } = data;

    let genderResponse =
      (GRUPO_DESCRICAO && GRUPO_DESCRICAO.split(", ")[2]) || null;
    let typeResponse =
      (GRUPO_DESCRICAO && GRUPO_DESCRICAO.split(", ")[3]) || null;

    // Substituição de palavras para gender e type
    if (genderResponse && this.wordsToSubstitute[genderResponse]) {
      genderResponse = this.wordsToSubstitute[genderResponse];
    }
    if (typeResponse && this.wordsToSubstitute[typeResponse]) {
      typeResponse = this.wordsToSubstitute[typeResponse];
    }

    const promoResponse =
      (ECOMMERCE_DESCRICAO && ECOMMERCE_DESCRICAO.includes("PROMO")) || false;
    const sizesResponse = (NUMEROS && NUMEROS.split(",")) || [];
    const quantitiesResponse = (QUANTIDADES && QUANTIDADES.split(",")) || [];

    let descriptionResponse = PROD_DESCRICAO;
    if (descriptionResponse) {
      this.wordsToRemove.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        descriptionResponse = descriptionResponse
          .replace(regex, "")
          .replace(/\s{2,}/g, " ");
      });
      descriptionResponse = descriptionResponse.trim();
      // Remove tudo após o primeiro '-'
      const dashIndex = descriptionResponse.indexOf("-");
      if (dashIndex !== -1) {
        descriptionResponse = descriptionResponse
          .substring(0, dashIndex)
          .trim();
      }
    }

    const slipperSizeRange = [];
    for (let i = 0; i < sizesResponse.length; i++) {
      const size = sizesResponse[i];
      const quantity = quantitiesResponse[i] || "0";
      slipperSizeRange.push({ NUMERO: size, QUANTIDADE: quantity });
    }

    // Extrai a cor da descrição do produto
    const newColor = this.extractColor(PROD_DESCRICAO);

    // Copia a cor
    Utils.copyToClipboard(newColor || "");

    return {
      gender: genderResponse,
      type: typeResponse,
      promo: promoResponse,
      slipperSizeRange,
      descriptionProduct: descriptionResponse,
      manufacturer: COD_FABRICANTE,
      newColor: newColor,
    };
  }
}

export default Formatter;
