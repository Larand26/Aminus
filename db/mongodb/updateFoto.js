const mongoose = require("mongoose");
const path = require("path");
const globals = require(path.join(__dirname, "../../globals"));
const Produto = require("./produtoModel");

const updateFoto = async (foto) => {
  await mongoose.connect(globals.MONGODB_URI);
  try {
    let id = foto._id;
    if (id && typeof id === "object" && id.buffer) {
      // Converte Uint8Array para Buffer antes de criar ObjectId
      id = new mongoose.Types.ObjectId(Buffer.from(id.buffer));
    }
    console.log(id);

    // Remover o _id do objeto foto para evitar conflito na atualização
    const { _id, ...fotoSemId } = foto;

    console.log(fotoSemId);

    // Certifique-se que fotoSemId.foto (ou o campo correto) é uma string base64
    if (fotoSemId.foto && typeof fotoSemId.foto !== "string") {
      fotoSemId.foto = fotoSemId.foto.toString("base64");
    }

    if (
      fotoSemId.fotos &&
      fotoSemId.fotos.foto_principal &&
      typeof fotoSemId.fotos.foto_principal === "string"
    ) {
      fotoSemId.fotos.foto_principal = Buffer.from(
        fotoSemId.fotos.foto_principal,
        "base64"
      );
    }

    if (fotoSemId.fotos) {
      Object.keys(fotoSemId.fotos).forEach((key) => {
        if (
          typeof fotoSemId.fotos[key] === "string" &&
          fotoSemId.fotos[key].length > 0
        ) {
          fotoSemId.fotos[key] = Buffer.from(fotoSemId.fotos[key], "base64");
        }
      });
    }

    const operacao = {
      updateOne: {
        filter: { _id: id },
        update: { $set: fotoSemId },
      },
    };
    const result = await Produto.bulkWrite([operacao]);
    return { success: true, result: fotoSemId };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    mongoose.connection.close();
  }
};

module.exports = { updateFoto };
