const { trackTNT } = require("./trackTNT");

const track = async (nota, transportadora) => {
  let response;
  switch (transportadora) {
    case "tnt":
      // Lógica para rastrear a nota com a transportadora TNT
      response = await trackTNT(nota);
      break;

    default:
      break;
  }
  console.log(response);
  return response;
};

module.exports = { track };
