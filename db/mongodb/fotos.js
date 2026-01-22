const mongoose = require("mongoose");
const path = require("path");
const globals = require(path.join(__dirname, "../../globals"));
const Produto = require("./produtoModel");

const connectDB = async () => {
  // console.log(mongoose.connection.readyState);

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(globals.MONGODB_URI);
  }
};

const searchFoto = async (produto) => {
  try {
    await connectDB();
    let pesquisa;
    if (produto.codFabricante === "") {
      pesquisa = { codigo_cor: produto.codCor.toUpperCase() };
    } else {
      pesquisa = {
        referencia: produto.codFabricante,
        codigo_cor: produto.codCor.toUpperCase(),
      };
    }
    if (produto.codCor === "") {
      pesquisa = { referencia: produto.codFabricante };
    }
    const produtos = await Produto.find(pesquisa);

    if (produtos.length === 0) {
      return { success: true, data: [] };
    }

    // Converte buffers para base64
    const produtosFormatados = produtos.map((prod) => {
      const prodObj = prod.toObject();
      const originalFotos = prodObj.fotos || {};
      const formattedFotos = {};

      for (const key in originalFotos) {
        if (Object.prototype.hasOwnProperty.call(originalFotos, key)) {
          const value = originalFotos[key];
          formattedFotos[key] = value ? value.toString("base64") : null;
        }
      }

      return {
        ...prodObj,
        fotos: formattedFotos,
      };
    });

    return { success: true, data: produtosFormatados };
  } catch (err) {
    console.error("Erro:", err);
    return { success: false, error: err.message };
  }
};

module.exports = { searchFoto };
