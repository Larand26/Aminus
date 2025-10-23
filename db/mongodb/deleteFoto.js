const mongoose = require("mongoose");
const path = require("path");
const globals = require(path.join(__dirname, "../../globals"));
const Produto = require("./produtoModel");

const deleteFoto = async (foto_id) => {
  try {
    await mongoose.connect(globals.MONGODB_URI);

    if (!foto_id) {
      console.log("ID da foto não informado.");
      mongoose.connection.close();
      return 0;
    }

    // Converte para ObjectId se necessário
    const objectId = new mongoose.Types.ObjectId(Buffer.from(foto_id.buffer));

    const resultado = await Produto.deleteOne({ _id: objectId });

    if (resultado.deletedCount === 0) {
      console.log(
        `${foto_id.referencia || ""} - ${
          foto_id.codigo_cor || ""
        } não encontrado para deletar.`
      );
    } else {
      console.log(
        `${resultado.deletedCount} produto(s) deletado(s) com sucesso.`
      );
    }

    mongoose.connection.close();
    return { deletedCount: resultado.deletedCount, success: true };
  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    mongoose.connection.close();
  }
};

module.exports = { deleteFoto };
