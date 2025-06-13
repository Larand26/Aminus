const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

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

const cadastraFotos = async (produto) => {
  const Produto = mongoose.model("Produto", produtoSchema, "FOTOS_COLLECTION");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(produto);

    // Verifica se produto com mesma referência + cor já existe
    const produtoExistente = await Produto.findOne({
      referencia: produto.referencia,
      codigo_cor: produto.codigo_cor,
    });

    if (produtoExistente) {
      console.log(
        `${produto.referencia} - ${produto.codigo_cor} já cadastrado.`
      );
      return;
    }

    // Verifica se já existe produto com mesma referência
    const produtoComMesmaReferencia = await Produto.findOne({
      referencia: produto.referencia,
    });

    // Se existir, copia os campos desejados
    if (produtoComMesmaReferencia) {
      produto.descricao_produto = produtoComMesmaReferencia.descricao_produto;
      produto.preco_revenda = produtoComMesmaReferencia.preco_revenda;
      produto.embalamento = produtoComMesmaReferencia.embalamento;
    }

    // Converte base64 para Buffer em cada campo de foto
    if (produto.fotos) {
      Object.keys(produto.fotos).forEach((key) => {
        if (produto.fotos[key]) {
          produto.fotos[key] = Buffer.from(produto.fotos[key], "base64");
        }
      });
    }

    const novoProduto = new Produto(produto);
    await novoProduto.save();

    console.log(
      "Produto salvo :" + produto.referencia + " - " + produto.nome_cor
    );
  } catch (err) {
    console.error("Erro:", err);
  }
};

module.exports = { cadastraFotos };
