import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    referencia: { type: String, trim: true },
    codigo_cor: { type: String, trim: true },
    nome_cor: { type: String, trim: true },
    descricao_produto: { type: String, trim: true },
    preco_revenda: { type: String, default: "0" },
    embalamento: { type: String, trim: true },
    fotos: [{ type: Buffer }],
    video_url: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "FOTOS_COLLECTION",
  },
);

const ProductModel =
  mongoose.models.Produto ||
  mongoose.model("Produto", ProductSchema, "FOTOS_COLLECTION");

export default ProductModel;
