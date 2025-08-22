const axios = require("axios");

const trackTNT = async (nota) => {
  try {
    const url = `https://radar.tntbrasil.com.br/radar/public/eventoNotaFiscalCliente/json/11984533000171/${nota}-1`;
    const response = await axios.get(url);
    console.log(response.data.ocorrencias[0].dsDescricaoEvento);

    const eventos = response.data.ocorrencias.map((ocorrencia) => ({
      descricao: ocorrencia.obComplemento,
      data: ocorrencia.dhEvento,
    }));

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
      expectativa: response.data.cabecalho.dtPrevEntrega,
      nomeDoRecebedor: response.data.cabecalho.nmRecebedor,
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
