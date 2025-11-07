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

    // Remover o _id do objeto foto para evitar conflito na atualização
    const { _id, ...fotoSemId } = foto;

    // Se 'fotos' for um array, converte cada string base64 para Buffer
    if (fotoSemId.fotos && Array.isArray(fotoSemId.fotos)) {
      fotoSemId.fotos = fotoSemId.fotos.map((fotoBase64) => {
        if (typeof fotoBase64 === "string" && fotoBase64.length > 0) {
          return Buffer.from(fotoBase64, "base64");
        }
        return fotoBase64; // Mantém valores que não são strings (ex: já são Buffers)
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
