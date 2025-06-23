const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Produto = require("./produtoModel");

const cadastraFotos = async (produto) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Verifica se produto com mesma referência + cor já existe
    const produtoExistente = await Produto.findOne({
      referencia: produto.referencia,
      codigo_cor: produto.codigo_cor,
    });

    if (produtoExistente) {
      console.log(
        `${produto.referencia} - ${produto.codigo_cor} já cadastrado.`
      );
      mongoose.connection.close();
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
    mongoose.connection.close();
  } catch (err) {
    console.error("Erro:", err);
    mongoose.connection.close();
  }
};

module.exports = { cadastraFotos };
