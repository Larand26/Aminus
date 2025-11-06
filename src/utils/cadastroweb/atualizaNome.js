const listaParaRemover = [
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
];

const atualizaNome = (itemSelecionado) => {
  if (!itemSelecionado?.COD_INTERNO) return "";
  // Remove os termos indesejados do nome do produto
  let nomeAtualizado = itemSelecionado?.nome || "";
  listaParaRemover.forEach((termo) => {
    const regex = new RegExp(`\\b${termo}\\b`, "gi");
    nomeAtualizado = nomeAtualizado.replace(regex, "").trim();
  });

  // Remove tudo o que vem depois do "-"
  const indiceHifen = nomeAtualizado.indexOf("-");
  if (indiceHifen !== -1) {
    nomeAtualizado = nomeAtualizado.substring(0, indiceHifen).trim();
  }

  nomeAtualizado =
    `${itemSelecionado?.tipo} ${itemSelecionado?.genero} ${nomeAtualizado}`.trim();

  switch (itemSelecionado.tipo) {
    case "SANDÁLIA":
    case "RASTEIRINHAS":
    case "BOTA":
    case "SAPATILHA":
      // Muda o nome do tipo
      nomeAtualizado = nomeAtualizado.replace("SANDÁLIA", "SANDALIA");
      nomeAtualizado = nomeAtualizado.replace("RASTEIRINHAS", "RASTEIRA");

      // Ajusta o gênero
      if (itemSelecionado.genero === "FEMININO")
        nomeAtualizado = nomeAtualizado.replace("FEMININO", "FEMININA");
      if (itemSelecionado.genero === "MASCULINO")
        nomeAtualizado = nomeAtualizado.replace("MASCULINO", "MASCULINA");
      break;
    case "CHINELO GÁSPEA/SLIDE":
      nomeAtualizado = nomeAtualizado.replace(
        "CHINELO GÁSPEA/SLIDE",
        "CHINELO SLIDE"
      );
      break;
    case "CHINELO DEDO":
      nomeAtualizado = nomeAtualizado.replace("CHINELO DEDO", "CHINELO");
      break;
    case "BABUCH":
      nomeAtualizado = nomeAtualizado.replace("BABUCH", "BABUCHE");
      break;

    default:
      break;
  }

  return nomeAtualizado + " - " + itemSelecionado.codFabricante;
};
export default atualizaNome;
