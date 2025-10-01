const mongoose = require("mongoose");
const path = require("path");
const globals = require(path.join(__dirname, "../../globals"));
const Produto = require("./produtoModel");

const connectDB = async () => {
  console.log(mongoose.connection.readyState);

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(globals.MONGODB_URI);
  }
};

const searchFoto = async (produto) => {
  try {
    await connectDB();
    let pesquisa;
    if (produto.referencia === "") {
      pesquisa = { codigo_cor: produto.codigo_cor };
    } else {
      pesquisa = {
        referencia: produto.referencia,
        codigo_cor: produto.codigo_cor,
      };
    }
    if (produto.codigo_cor === "") {
      pesquisa = { referencia: produto.referencia };
    }
    const produtos = await Produto.find(pesquisa);

    if (produtos.length === 0) {
      return [];
    }

    // Converte buffers para base64
    const produtosFormatados = produtos.map((prod) => {
      const fotos = prod.fotos || {};
      return {
        ...prod.toObject(),
        fotos: {
          ...fotos,
          foto_principal: fotos.foto_principal
            ? fotos.foto_principal.toString("base64")
            : null,
          foto_produto_1: fotos.foto_produto_1
            ? fotos.foto_produto_1.toString("base64")
            : null,
          foto_produto_2: fotos.foto_produto_2
            ? fotos.foto_produto_2.toString("base64")
            : null,
          foto_produto_3: fotos.foto_produto_3
            ? fotos.foto_produto_3.toString("base64")
            : null,
          foto_produto_4: fotos.foto_produto_4
            ? fotos.foto_produto_4.toString("base64")
            : null,
          foto_produto_5: fotos.foto_produto_5
            ? fotos.foto_produto_5.toString("base64")
            : null,
          foto_complementar: fotos.foto_complementar
            ? fotos.foto_complementar.toString("base64")
            : null,
        },
      };
    });

    return produtosFormatados;
  } catch (err) {
    console.error("Erro:", err);
    return [];
  }
};

module.exports = { searchFoto };
