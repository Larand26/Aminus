import MongoDB from "../database/MongoDB.js";
import ProductModel from "../models/ProductModel.js";
import { dialog, app } from "electron";
import fs from "fs";
import path from "path";

class PhotoService {
  static async getPhotosProduct(filters = {}) {
    try {
      const mongoFilters = {};

      if (filters.manufacturer) mongoFilters.referencia = filters.manufacturer;
      if (filters.color) mongoFilters.codigo_cor = filters.color;

      const photos = await MongoDB.find(ProductModel, mongoFilters);
      return {
        success: true,
        data: photos,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching photos.",
      };
    }
  }

  static async updatePhoto(args) {
    const { id, newData } = args;
    try {
      const updatedPhoto = await MongoDB.update(ProductModel, id, newData);
      return {
        success: true,
        data: updatedPhoto,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while updating the photo.",
      };
    }
  }

  static async createPhoto(args) {
    try {
      const existingPhoto = await MongoDB.find(ProductModel, {
        referencia: args.referencia,
      });
      if (
        existingPhoto.length > 0 &&
        existingPhoto.some(
          (photo) =>
            photo.codigo_cor === args.codColor ||
            photo.nome_cor === args.nameColor,
        )
      ) {
        return {
          success: false,
          error: "Photo already exists.",
          message: "A photo with the same reference and color already exists.",
        };
      }

      const newPhoto = {
        referencia: args.referencia,
        codigo_cor: args.codColor,
        nome_cor: args.nameColor,
        descricao_produto: existingPhoto[0].descricao_produto,
        preco_revenda: existingPhoto[0].preco_revenda,
        embalamento: existingPhoto[0].embalamento,
        fotos: args.photos,
        video_url: args.url,
      };

      const createdPhoto = await MongoDB.create(ProductModel, newPhoto);
      return {
        success: true,
        data: createdPhoto,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while creating the photo.",
      };
    }
  }

  /**
   *
   * @param {Array[Object<{referencia: String, codigo_cor: String, fotos: Array[Base64String]}]>}
   * @returns {Array[Object<{referencia: String, codigo_cor: String, fotos: Array[Buffer]}]>}
   */
  static async resizePhotos(products) {
    try {
      const sharp = (await import("sharp")).default;
      const processedProducts = [];

      for (const product of products) {
        const processedFotos = [];
        for (let i = 0; i < product.fotos.length; i++) {
          const base64 = product.fotos[i];
          const buffer = Buffer.isBuffer(base64)
            ? base64
            : Buffer.from(
                base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ""),
                "base64",
              );

          if (i === 0) {
            // Primeira foto: 800x800px, preenchendo com branco
            const resized = await sharp(buffer)
              .resize(800, 800, {
                fit: "contain",
                background: { r: 255, g: 255, b: 255, alpha: 1 },
              })
              .jpeg()
              .toBuffer();
            processedFotos.push({ buffer: resized });
          } else {
            // Outras fotos: máximo 800px largura ou altura, mantendo proporção
            const metadata = await sharp(buffer).metadata();
            let width = metadata.width;
            let height = metadata.height;
            let resizeOptions = {};
            if (width > height) {
              resizeOptions.width = 800;
            } else {
              resizeOptions.height = 800;
            }
            const resized = await sharp(buffer)
              .resize(resizeOptions)
              .jpeg()
              .toBuffer();
            processedFotos.push({ buffer: resized });
          }
        }
        processedProducts.push({
          ...product,
          fotos: processedFotos,
        });
      }
      return {
        success: true,
        data: processedProducts,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while resizing photos.",
      };
    }
  }

  /**
   *
   * @param {} args
   * @returns
   */
  static async downloadPhoto(args) {
    const { products } = args; //Array[Object<{referencia: String, codigo_cor: String, fotos: Array[Buffer]}]>]
    try {
      // 1. Abrir o dialog para o usuário escolher a pasta
      const result = await dialog.showOpenDialog({
        title: "Escolha a pasta para salvar as fotos",
        properties: ["openDirectory"],
      });

      if (result.canceled || !result.filePaths.length) {
        return { success: false, message: "Operação cancelada pelo usuário." };
      }

      const folderPath = result.filePaths[0];

      // 2. Salvar cada foto na pasta escolhida
      for (const product of products) {
        const productDir = path.join(folderPath, `${product.referencia}`);
        if (!fs.existsSync(productDir)) {
          fs.mkdirSync(productDir, { recursive: true });
        }
        for (let i = 0; i < product.fotos.length; i++) {
          const photo = product.fotos[i];
          // photo.buffer deve ser um Buffer ou Uint8Array
          fs.writeFileSync(
            path.join(
              productDir,
              `${product.referencia}_${product.codigo_cor}_${i + 1}.jpg`,
            ),
            photo.buffer,
          );
        }
      }

      return {
        success: true,
        message: "Fotos baixadas com sucesso.",
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        error: error.message,
        message: "Ocorreu um erro ao baixar as fotos.",
      };
    }
  }
}

export default PhotoService;
