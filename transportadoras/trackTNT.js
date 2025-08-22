const axios = require("axios");

const trackTNT = async (nota) => {
  try {
    const url = `https://radar.tntbrasil.com.br/radar/public/eventoNotaFiscalCliente/json/11984533000171/${nota}-1`;
    const response = await axios.get(url);

    const eventos = response.data.ocorrencias.map((ocorrencia) => {
      let dataObj = ocorrencia.dhEvento;
      if (typeof dataObj === "string" && dataObj.includes("/")) {
        const [datePart, timePart] = dataObj.split(" ");
        const [day, month, year] = datePart.split("/");
        const [hour = 0, min = 0, sec = 0] = (timePart || "00:00:00").split(
          ":"
        );
        const date = new Date(year, month - 1, day, hour, min, sec);
        dataObj = date;
      } else if (dataObj instanceof Date) {
        dataObj = dataObj;
      }
      return {
        descricao: ocorrencia.obComplemento,
        data: dataObj,
      };
    });

    const dateExpected = response.data.cabecalho.dtPrevEntrega; // Formato DD/MM/AAAA

    let status = null;

    const [day, month, year] = dateExpected.split("/");

    const dateExpec = new Date(year, month - 1, day);
    const today = new Date();
    // Verifica se está atrasado
    if (today > dateExpec) {
      status = "Atrasado";
    }
    const result = {
      nome: response.data.cabecalho.nmPessoaDestinatario,
      eventos: eventos,
      status: status || response.data.cabecalho.status,
      expectativa: dateExpec,
      cnpj: "",
      sucesso: true,
    };

    return result;
  } catch (error) {
    return {
      nome: "",
      eventos: [],
      status: "Erro",
      expectativa: "",
      nomeDoRecebedor: "",
      cnpj: "",
      sucesso: false,
      mensagem: error.message,
    };
  }
};

module.exports = {
  trackTNT,
};
