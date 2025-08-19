const mongoose = require("mongoose");
const path = require("path");
const globals = require(path.join(__dirname, "../../globals"));
const Produto = require("./produtoModel");

const deleteFoto = async (produto) => {
  try {
    await mongoose.connect(globals.MONGODB_URI);

    if (!produto._id) {
      console.log("ID do produto não informado.");
      mongoose.connection.close();
      return 0;
    }

    // Garante que o _id seja um ObjectId válido
    let id;
    if (typeof produto._id === "string") {
      id = new mongoose.Types.ObjectId(produto._id);
    } else if (produto._id._id) {
      id = new mongoose.Types.ObjectId(produto._id._id);
    } else if (produto._id.buffer) {
      id = new mongoose.Types.ObjectId(produto._id.buffer);
    } else {
      id = new mongoose.Types.ObjectId(produto._id);
    }

    const resultado = await Produto.deleteOne({ _id: id });

    if (resultado.deletedCount === 0) {
      console.log(
        `${produto.referencia || ""} - ${
          produto.codigo_cor || ""
        } não encontrado para deletar.`
      );
    } else {
      console.log(
        `${resultado.deletedCount} produto(s) deletado(s) com sucesso.`
      );
    }

    mongoose.connection.close();
    return resultado.deletedCount;
  } catch (err) {
    console.error("Erro:", err);
    mongoose.connection.close();
    return 0;
  }
};

module.exports = { deleteFoto };
