const mongoose = require("mongoose");

const produtoSchema = new mongoose.Schema({
  referencia: String,
  codigo_cor: String,
  nome_cor: String,
  descricao_produto: String,
  preco_revenda: String,
  embalamento: String,
  fotos: {
    foto_principal: Buffer,
    foto_produto_1: Buffer,
    foto_produto_2: Buffer,
    foto_produto_3: Buffer,
    foto_produto_4: Buffer,
    foto_produto_5: Buffer,
    foto_complementar: Buffer,
  },
});

const Produto =
  mongoose.models.Produto ||
  mongoose.model("Produto", produtoSchema, "FOTOS_COLLECTION");

module.exports = Produto;
