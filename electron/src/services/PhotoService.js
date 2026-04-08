import MongoDB from "../database/MongoDB.js";
import ProductModel from "../models/ProductModel.js";
import Utils from "../utils/Utils.js";
import { dialog, app } from "electron";
import fs from "fs";
import path from "path";

class PhotoService {
  static normalizePhotoBuffer(photo) {
    if (Buffer.isBuffer(photo)) {
      return photo;
    }

    if (photo && typeof photo === "object" && photo.buffer) {
      return Buffer.isBuffer(photo.buffer)
        ? photo.buffer
        : Buffer.from(photo.buffer);
    }

    if (typeof photo === "string") {
      return Utils.base64ToBuffer(photo);
    }

    return photo;
  }

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

  /**
   *
   * @param {Object<{id:Buffer, newData:Object<{fotos: Array<Base64URLString>}>}>} args
   * @returns
   */
  static async updatePhoto(args) {
    const { id, newData } = args;
    const { codigo_cor, fotos, nome_cor } = newData;
    try {
      if (fotos) {
        newData.fotos = fotos.map((photo) =>
          PhotoService.normalizePhotoBuffer(photo),
        );
      }
      if (codigo_cor) newData.codigo_cor = codigo_cor.toUpperCase();
      if (nome_cor) newData.nome_cor = nome_cor.toUpperCase();

      const updatedPhoto = await MongoDB.update(ProductModel, id, newData);
      return {
        success: true,
        data: updatedPhoto,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        error: error.message,
        message: "An error occurred while updating the photo.",
      };
    }
  }

  /**
   * Cria novas fotos para os produtos. O argumento `args` deve conter um array `newPhotos` com as informações das fotos a serem criadas.
   * @param {Object<{newManufacturerCode: string, newPackaging: string, newDescription: string, newPhotos: { photo: Array<Base64URLString>, color: string, colorCode: string }  }>} newPhotos
   * @returns
   */
  static async createPhoto(newPhotos) {
    const {
      newManufacturerCode,
      newPackaging,
      newResalePrice,
      newDescription,
      newPhotos: photosToCreate,
    } = newPhotos;

    try {
      const responses = [];
      for (const photoData of photosToCreate) {
        // Verificar se já existe um produto com a mesma referência, código de cor e/ou nome de cor
        const existingProduct = await MongoDB.findOne(ProductModel, {
          referencia: newManufacturerCode,
          $or: [
            { codigo_cor: photoData.colorCode.toUpperCase() },
            { nome_cor: photoData.color.toUpperCase() },
          ],
        });

        if (existingProduct) {
          responses.push({
            success: false,
            error: "Product with the same reference and color already exists.",
            data: existingProduct,
          });
          continue; // Pular para a próxima foto
        }

        // Verifica se o tem outros produtos com a mesma referência para reutilizar essas informações
        const similarProduct = await MongoDB.findOne(ProductModel, {
          referencia: newManufacturerCode,
        });

        // Criar o novo produto com as fotos
        const newProduct = {
          referencia: newManufacturerCode,
          embalamento: similarProduct?.embalamento || newPackaging,
          preco_revenda: similarProduct?.preco_revenda || newResalePrice,
          descricao_produto:
            similarProduct?.descricao_produto || newDescription,
          codigo_cor: photoData.colorCode.toUpperCase(),
          nome_cor: photoData.color.toUpperCase(),
          fotos: photoData.photo.map((photo) =>
            PhotoService.normalizePhotoBuffer(photo),
          ),
        };
        const createdProduct = await MongoDB.create(ProductModel, newProduct);
        responses.push({
          success: true,
          data: createdProduct,
        });
      }

      return {
        success: true,
        data: responses,
      };
    } catch (error) {
      console.log(error);

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

  static async deletePhoto(photoId) {
    try {
      await MongoDB.delete(ProductModel, photoId);
      return {
        success: true,
        message: "Photo deleted successfully.",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while deleting the photo.",
      };
    }
  }
}

export default PhotoService;
