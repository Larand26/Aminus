class Frenet {
  static async calculateFreight(args) {
    const { token, selectedOrderData, selectItemOrder, selectedOrder } = args;
    try {
      /**
       *  { token, shipping: { cep, price, orderItems: [{ ALTURA, COMPRIMENTO, QUANTIDADE, PESO_BRUTO, LARGURA }], selectedItem: { ALTURA, COMPRIMENTO, QUANTIDADE, PESO_BRUTO, LARGURA } } }
       */
      const price = selectedOrderData.reduce(
        (total, item) => total + item.PRECO * item.QUANTIDADE,
        0,
      );
      const quantity = Math.ceil(
        selectedOrderData.reduce(
          (total, item) => total + item.QUANTIDADE / 12,
          0,
        ),
      );
      const shipping = {
        cep: selectedOrder.CEP,
        price,
        quantity,
        orderItems: selectedOrderData.map((item) => ({
          ALTURA: item.ALTURA,
          COMPRIMENTO: item.COMPRIMENTO,
          QUANTIDADE: item.QUANTIDADE,
          PESO_BRUTO: item.PESO_BRUTO,
          LARGURA: item.LARGURA,
        })),
        selectedItem: {
          ALTURA: selectItemOrder[0].ALTURA,
          COMPRIMENTO: selectItemOrder[0].COMPRIMENTO,
          PESO_BRUTO: selectItemOrder[0].PESO_BRUTO,
          LARGURA: selectItemOrder[0].LARGURA,
        },
      };

      return await window.api.calculateFreight({ token, shipping });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching products.",
      };
    }
  }

  /**
   * Transportadoras com cálculo próprio. A cotação da `source` só vale
   * para o ServiceCode da chave; para as demais ela é ignorada.
   */
  static SPECIAL_RULES = {
    BRAS_R: {
      source: "braspress",
      label: "Volume único",
      description:
        "Braspress: peso total do pedido em um único volume 20×30×45",
    },
    JAM: {
      source: "custom",
      label: "Maior item",
      description:
        "JAM: medidas do item mais pesado × quantidade total de caixas",
    },
  };

  /**
   * Transportadoras cotadas por peso real (caixa 20×30×45). Todas as
   * outras são cotadas por peso cubado (medidas do produto).
   * Comparação pelo código, transportadora ou descrição do serviço.
   */
  static REAL_WEIGHT_CARRIERS = [/braspress/i, /^BRAS_/i, /rodonaves/i];

  static SOURCE_LABELS = {
    rule: "regra específica",
    box: "peso real",
    product: "peso cubado",
  };

  static isRealWeight(service, code) {
    const text = [code, service?.Carrier, service?.ServiceDescription]
      .filter(Boolean)
      .join(" ");
    return this.REAL_WEIGHT_CARRIERS.some((regex) => regex.test(text));
  }

  /**
   * @typedef {Object} FreightQuote
   * @property {number|null} price
   * @property {number|null} originalPrice  preço antes do desconto (se houver)
   * @property {number|null} deliveryTime   dias úteis
   * @property {string|null} error          mensagem quando a cotação falhou
   */

  /**
   * @typedef {Object} FreightRow
   * @property {string} code
   * @property {string} name
   * @property {{label: string, description: string}|null} rule
   * @property {{rule: FreightQuote|null, box: FreightQuote|null, product: FreightQuote|null}} quotes
   * @property {"real"|"cubado"} weight  tipo de peso da transportadora
   * @property {"rule"|"box"|"product"|null} source  cotação usada no valor final
   * @property {FreightQuote|null} final
   * @property {boolean} available
   * @property {string} errorMessage
   * @property {boolean} cheapest
   * @property {boolean} fastest
   */

  static #toQuote(service) {
    if (!service) return null;
    const toNumber = (value) => {
      const parsed = Number(value);
      return value !== null && value !== "" && Number.isFinite(parsed)
        ? parsed
        : null;
    };
    // Com frete grátis/desconto (ex.: pedido acima de R$ 3.000) a Frenet
    // devolve ShippingPrice 0 e o valor real em OriginalShippingPrice.
    // Mostramos sempre o valor real.
    const shippingPrice = toNumber(service.ShippingPrice);
    const originalPrice = toNumber(service.OriginalShippingPrice);
    const price =
      shippingPrice !== null && originalPrice !== null
        ? Math.max(shippingPrice, originalPrice)
        : shippingPrice;
    const hasError = Boolean(service.Error) || price === null;
    return {
      price: hasError ? null : price,
      originalPrice,
      deliveryTime: toNumber(service.DeliveryTime),
      error: hasError ? service.Msg || "Sem cotação" : null,
    };
  }

  /**
   * Junta as 4 cotações da Frenet em uma linha por transportadora.
   * Nenhuma transportadora é descartada: as que falharam em todas as
   * cotações aparecem como indisponíveis, com o motivo.
   * @param {Object|null} data { standard, custom, "20-30-45", braspress }
   * @returns {FreightRow[]|null}
   */
  static buildFreightRows(data) {
    if (!data) return null;

    const list = (key) => data[key]?.ShippingSevicesArray || [];
    const byCode = (key) =>
      new Map(list(key).map((service) => [service.ServiceCode, service]));

    const box = byCode("20-30-45");
    const product = byCode("standard");
    const sources = { custom: byCode("custom"), braspress: byCode("braspress") };

    // Ordem: 20-30-45, depois o que só veio nas outras cotações
    const codes = new Set([...box.keys(), ...product.keys()]);
    Object.entries(this.SPECIAL_RULES).forEach(([code, rule]) => {
      if (sources[rule.source].has(code)) codes.add(code);
    });

    const rows = [...codes].map((code) => {
      const rule = this.SPECIAL_RULES[code] || null;
      const reference =
        box.get(code) ||
        product.get(code) ||
        (rule && sources[rule.source].get(code));

      const quotes = {
        rule: rule ? this.#toQuote(sources[rule.source].get(code)) : null,
        box: this.#toQuote(box.get(code)),
        product: this.#toQuote(product.get(code)),
      };

      // Peso real (Braspress, Rodonaves) usa a caixa 20×30×45;
      // as demais usam as medidas do produto (peso cubado).
      const realWeight = this.isRealWeight(reference, code);
      const weightSource = realWeight ? "box" : "product";
      const candidates = rule ? ["rule", weightSource] : [weightSource];

      const source = candidates.find((key) => quotes[key]?.price != null);
      const errorMessage =
        candidates.map((key) => quotes[key]).find((q) => q?.error)?.error ||
        "Sem cotação";

      return {
        code,
        name:
          reference?.ServiceDescription || reference?.Carrier || code || "",
        carrier: reference?.Carrier || "",
        rule: rule ? { label: rule.label, description: rule.description } : null,
        quotes,
        weight: realWeight ? "real" : "cubado",
        source: source || null,
        final: source ? quotes[source] : null,
        available: Boolean(source),
        errorMessage: source ? "" : errorMessage,
        cheapest: false,
        fastest: false,
      };
    });

    const available = rows.filter((row) => row.available);
    if (available.length > 0) {
      const minPrice = Math.min(...available.map((row) => row.final.price));
      const times = available
        .map((row) => row.final.deliveryTime)
        .filter((time) => time != null);
      const minTime = times.length > 0 ? Math.min(...times) : null;
      available.forEach((row) => {
        row.cheapest = row.final.price === minPrice;
        row.fastest = minTime != null && row.final.deliveryTime === minTime;
      });
    }

    // Disponíveis do mais barato ao mais caro; indisponíveis no fim
    return [
      ...available.sort((a, b) => a.final.price - b.final.price),
      ...rows.filter((row) => !row.available),
    ];
  }
}

export default Frenet;
