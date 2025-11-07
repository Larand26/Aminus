const mongoose = require("mongoose");

const produtoSchema = new mongoose.Schema({
  referencia: String,
  codigo_cor: String,
  nome_cor: String,
  descricao_produto: String,
  preco_revenda: String,
  embalamento: String,
  fotos: [Buffer],
});

const Produto =
  mongoose.models.Produto ||
  mongoose.model("Produto", produtoSchema, "FOTOS_COLLECTION");

module.exports = Produto;
