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
      newIsEva = false,
    } = newPhotos; //[cite: 13]

    try {
      const responses = [];

      // Agora importamos o sharp sempre, pois ele será usado para redimensionar todas as fotos
      const sharp = (await import("sharp")).default; //[cite: 13]

      let svgPath;
      if (newIsEva) {
        //[cite: 13]
        const url = await import("url");
        const __filename = url.fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        svgPath = path.join(__dirname, "../assets/EVA.svg"); //[cite: 13]
      }

      for (const photoData of photosToCreate) {
        //[cite: 13]
        // Verificar se já existe um produto com a mesma referência, código de cor e/ou nome de cor
        const existingProduct = await MongoDB.findOne(ProductModel, {
          //[cite: 13]
          referencia: newManufacturerCode,
          $or: [
            { codigo_cor: photoData.colorCode.toUpperCase() }, //[cite: 13]
            { nome_cor: photoData.color.toUpperCase() }, //[cite: 13]
          ],
        });

        if (existingProduct) {
          //[cite: 13]
          responses.push({
            //[cite: 13]
            success: false,
            error: "Product with the same reference and color already exists.",
            data: existingProduct, //[cite: 13]
          });
          continue; // Pular para a próxima cor/foto[cite: 13]
        }

        // Verifica se tem outros produtos com a mesma referência para reutilizar essas informações
        const similarProduct = await MongoDB.findOne(ProductModel, {
          //[cite: 13]
          referencia: newManufacturerCode, //[cite: 13]
        });

        // Processa as fotos individualmente (Redimensionamento + Marca D'água)
        const processadas = [];
        for (let i = 0; i < photoData.photo.length; i++) {
          //[cite: 13]
          let buffer = PhotoService.normalizePhotoBuffer(photoData.photo[i]); //[cite: 13]

          if (i === 0) {
            // 1. Primeira foto: 800x800px, preenchendo com branco
            buffer = await sharp(buffer)
              .resize(800, 800, {
                fit: "contain",
                background: { r: 255, g: 255, b: 255, alpha: 1 },
              })
              .jpeg()
              .toBuffer();

            // 2. Aplica a marca d'água na primeira foto, se newIsEva for true
            if (newIsEva) {
              //[cite: 13]
              if (fs.existsSync(svgPath)) {
                //[cite: 13]
                // Força o SVG a ficar dentro de uma "caixa" de no máximo 320x320, mantendo a proporção.
                // Isso evita o erro de composite independente do formato do SVG.
                const resizedSvg = await sharp(svgPath)
                  .resize({ width: 320, height: 320, fit: "inside" })
                  .png() // PNG para manter transparência do SVG
                  .toBuffer();

                buffer = await sharp(buffer)
                  .composite([{ input: resizedSvg, gravity: "northeast" }])
                  .jpeg() // Garante a saída em jpeg no final
                  .toBuffer();
              } else {
                console.warn(`Aviso: Arquivo SVG não encontrado em ${svgPath}`);
              }
            }
          } else {
            // Outras fotos: máximo 800px largura ou altura, mantendo proporção
            const metadata = await sharp(buffer).metadata();
            let resizeOptions = {};
            if (metadata.width > metadata.height) {
              resizeOptions.width = 800;
            } else {
              resizeOptions.height = 800;
            }

            buffer = await sharp(buffer)
              .resize(resizeOptions)
              .jpeg()
              .toBuffer();
          }

          processadas.push(buffer);
        }

        // Criar o novo produto com as fotos processadas e redimensionadas
        const newProduct = {
          //[cite: 13]
          referencia: newManufacturerCode, //[cite: 13]
          embalamento: similarProduct?.embalamento || newPackaging, //[cite: 13]
          preco_revenda: similarProduct?.preco_revenda || newResalePrice, //[cite: 13]
          descricao_produto:
            similarProduct?.descricao_produto || newDescription, //[cite: 13]
          codigo_cor: photoData.colorCode.toUpperCase(), //[cite: 13]
          nome_cor: photoData.color.toUpperCase(), //[cite: 13]
          fotos: processadas, //[cite: 13]
        };

        const createdProduct = await MongoDB.create(ProductModel, newProduct); //[cite: 13]
        responses.push({
          //[cite: 13]
          success: true, //[cite: 13]
          data: createdProduct, //[cite: 13]
        });
      }

      return {
        //[cite: 13]
        success: true, //[cite: 13]
        data: responses, //[cite: 13]
      };
    } catch (error) {
      //[cite: 13]
      console.log(error); //[cite: 13]

      return {
        //[cite: 13]
        success: false, //[cite: 13]
        error: error.message, //[cite: 13]
        message: "An error occurred while creating the photo.", //[cite: 13]
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
