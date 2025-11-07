import searchFotos from "../search/searchFotos";

const atualizaItemSelecionado = async (itensSelecionado) => {
  const [fabrica, marca, genero, tipo, colecao] =
    itensSelecionado?.GRUPO_DESCRICAO.split(", ") || [];

  let grade = [];
  if (!itensSelecionado?.QUANTIDADES || !itensSelecionado?.NUMEROS) {
  } else {
    const quantidades = itensSelecionado?.QUANTIDADES.split(",") || [];
    const numeros = itensSelecionado?.NUMEROS.split(",") || [];

    grade = numeros.map((numero, index) => ({
      NUMERO: numero.trim(),
      QUANTIDADE: parseInt(quantidades[index].trim(), 10) || 0,
    }));
  }

  const prodDescricao = itensSelecionado?.PROD_DESCRICAO || "";
  const match = prodDescricao.match(/\}(.*?)\(/);
  const cor = match ? match[1].trim() : null;

  if (cor) {
    navigator.clipboard.writeText(cor).catch((err) => {
      console.error("Falha ao copiar a cor: ", err);
    });
  }
  const filters = {
    codFabricante: itensSelecionado?.COD_FABRICANTE || "",
    codInterno: "",
    codCor: itensSelecionado?.COD_COR || "",
  };

  const response = await searchFotos(filters);
  let fotoB64 = null;
  if (response && response.length > 0) {
    fotoB64 = `data:image/jpeg;base64,${response[0].fotos.foto_principal}`;
  }

  const itemSelecionado = {
    COD_INTERNO: itensSelecionado?.COD_INTERNO || "",
    foto: fotoB64,
    fabrica,
    marca,
    genero,
    tipo,
    promo: colecao == "PROMO",
    grade,
    nome: itensSelecionado?.PROD_DESCRICAO || "",
    codFabricante: itensSelecionado?.COD_FABRICANTE || "",
  };

  return { itemAtualizado: itemSelecionado, cor: cor || "" };
};

export default atualizaItemSelecionado;
