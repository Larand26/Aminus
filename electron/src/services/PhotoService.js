import MySQLDB from "../database/MySQLDB.js";
import PhotoRepository from "../repositories/PhotoRepository.js";
import PhotosApiService from "./PhotosApiService.js";
import { dialog, session } from "electron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVA_SVG_PATH = path.join(__dirname, "../assets/EVA.svg");
const PACKING_VALUES = ["f", "c"];

/**
 * @typedef {import("../repositories/PhotoRepository.js").CatalogProduct} CatalogProduct
 *
 * @typedef {Object} UpdateProductData
 * @property {string} manufacturer_code
 * @property {string} packing
 * @property {number|string} resale_price
 * @property {string} description
 * @property {string} color_name
 * @property {string} color_code
 * @property {Array<string>} photos URLs já gravadas ou data URLs (base64) de fotos novas, na ordem de exibição
 *
 * @typedef {Object} NewPhotosPayload
 * @property {string} newManufacturerCode
 * @property {string} [newPackaging]
 * @property {number|string} [newResalePrice]
 * @property {string} [newDescription]
 * @property {boolean} [newIsEva]
 * @property {Array<{photo: Array<string>, color: string, colorCode: string}>} newPhotos
 */

class PhotoService {
  static isRemoteUrl(value) {
    return typeof value === "string" && /^https?:\/\//i.test(value);
  }

  static dataUrlToBuffer(dataUrl) {
    return Buffer.from(dataUrl.replace(/^data:[^;,]+;base64,/, ""), "base64");
  }

  /** Aceita "24,99", "R$ 24.99" ou número. */
  static parsePrice(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const normalized = String(value ?? "")
      .replace(/[^\d,.-]/g, "")
      .replace(/\.(?=\d{3}(\D|$))/g, "")
      .replace(",", ".");
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  static normalizeCode(value) {
    return String(value ?? "").trim().toUpperCase();
  }

  static assertKeySegment(value, label) {
    if (!PhotosApiService.isValidKeySegment(value)) {
      throw new Error(
        `${label} inválido ("${value}"): use apenas letras, números, "-" e "_".`,
      );
    }
  }

  /**
   * Primeira foto: 800x800 com fundo branco (e selo EVA, se pedido). Demais: lado maior com 800px.
   * @returns {Promise<Buffer>}
   */
  static async processPhoto(buffer, index, { isEva = false } = {}) {
    const sharp = (await import("sharp")).default;

    if (index > 0) {
      const { width = 0, height = 0 } = await sharp(buffer).metadata();
      const resizeOptions = width > height ? { width: 800 } : { height: 800 };
      return sharp(buffer).resize(resizeOptions).jpeg().toBuffer();
    }

    let output = await sharp(buffer)
      .resize(800, 800, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .jpeg()
      .toBuffer();

    if (isEva) {
      if (fs.existsSync(EVA_SVG_PATH)) {
        // Limita o SVG a 320x320 para o composite não falhar com SVGs maiores que a foto.
        const watermark = await sharp(EVA_SVG_PATH)
          .resize({ width: 320, height: 320, fit: "inside" })
          .png()
          .toBuffer();
        output = await sharp(output)
          .composite([{ input: watermark, gravity: "northeast" }])
          .jpeg()
          .toBuffer();
      } else {
        console.warn(`Aviso: Arquivo SVG não encontrado em ${EVA_SVG_PATH}`);
      }
    }

    return output;
  }

  /**
   * O upload sempre declara image/jpeg e a photos-api confere os magic bytes; fotos migradas
   * em PNG/WebP são convertidas sem redimensionar. JPEG passa direto, sem recompressão.
   * @returns {Promise<Buffer>}
   */
  static async ensureJpeg(buffer) {
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    if (isJpeg) return buffer;

    const sharp = (await import("sharp")).default;
    return sharp(buffer)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg()
      .toBuffer();
  }

  /**
   * Grava as fotos na photos-api, na ordem recebida, e retorna as URLs finais.
   * Fotos que já estão na chave da posição de destino não são reenviadas; as demais são baixadas
   * antes de qualquer upload, porque um upload pode sobrescrever a chave de outra foto da lista.
   * @param {{manufacturerCode: string, colorCode: string, photos: Array<string>, isEva?: boolean}} args
   * @returns {Promise<Array<string>>}
   */
  static async storePhotos({ manufacturerCode, colorCode, photos, isEva = false }) {
    const pending = await Promise.all(
      photos.map(async (photo, index) => {
        const position = index + 1;
        const key = PhotosApiService.buildPhotoKey(manufacturerCode, colorCode, position);

        if (PhotoService.isRemoteUrl(photo)) {
          if (PhotosApiService.urlMatchesKey(photo, key)) return { url: photo };
          const buffer = await PhotoService.ensureJpeg(await PhotosApiService.fetchPhoto(photo));
          return { position, buffer };
        }

        const buffer = await PhotoService.processPhoto(
          PhotoService.dataUrlToBuffer(photo),
          index,
          { isEva },
        );
        return { position, buffer };
      }),
    );

    const urls = [];
    for (const item of pending) {
      urls.push(
        item.url ??
          (await PhotosApiService.uploadPhoto({
            manufacturerCode,
            colorCode,
            position: item.position,
            buffer: item.buffer,
          })),
      );
    }
    return urls;
  }

  /**
   * Não pode haver dois produtos com a mesma referência e o mesmo nome de cor; o código de cor
   * também não pode repetir, porque define a chave das fotos no bucket.
   * @param {CatalogProduct} conflict
   */
  static describeVariantConflict(conflict, { manufacturerCode, colorCode, colorName }) {
    if (conflict.color_code === colorCode) {
      return {
        reason: "duplicate_color_code",
        error:
          `A referência ${manufacturerCode} já tem a cor ${colorCode} (${conflict.color_name}) ` +
          `cadastrada. Para trocar ou adicionar fotos dela, use "Editar" na galeria.`,
        data: conflict,
      };
    }
    return {
      reason: "duplicate_color_name",
      error:
        `A referência ${manufacturerCode} já tem o nome de cor "${colorName}" ` +
        `(código ${conflict.color_code}). Altere o nome para "${colorName} (${colorCode})" e salve novamente.`,
      data: conflict,
    };
  }

  // As URLs não mudam quando uma foto é sobrescrita; sem isso o Chromium exibe a versão em cache.
  static async clearImageCache() {
    try {
      await session.defaultSession.clearCache();
    } catch (error) {
      console.warn("Não foi possível limpar o cache de imagens:", error.message);
    }
  }

  /** @param {{manufacturer?: string, color?: string}} filters */
  static async getPhotosProduct(filters = {}) {
    try {
      const products = await PhotoRepository.findProducts({
        manufacturer: filters.manufacturer?.trim() || undefined,
        color: filters.color?.trim() || undefined,
      });
      return { success: true, data: products };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching photos.",
      };
    }
  }

  /**
   * @param {{id: number, newData: UpdateProductData}} args
   */
  static async updatePhoto(args) {
    const { id, newData } = args;
    try {
      const current = await PhotoRepository.findProductById(id);
      if (!current) {
        return { success: false, error: "Produto não encontrado." };
      }

      const manufacturerCode =
        String(newData.manufacturer_code ?? current.manufacturer_code).trim();
      const colorCode = PhotoService.normalizeCode(newData.color_code ?? current.color_code);
      const colorName = PhotoService.normalizeCode(newData.color_name ?? current.color_name);
      const packing = String(newData.packing ?? current.packing).toLowerCase();

      PhotoService.assertKeySegment(manufacturerCode, "Código do fabricante");
      PhotoService.assertKeySegment(colorCode, "Código da cor");
      if (!colorName) throw new Error("O nome da cor é obrigatório.");
      if (!PACKING_VALUES.includes(packing)) throw new Error(`Embalagem inválida: "${packing}".`);

      // Antes do upload: com o mesmo código de cor, as fotos sobrescreveriam as do outro produto.
      const conflict = await PhotoRepository.findProductByVariant({
        manufacturerCode,
        colorCode,
        colorName,
        excludeId: id,
      });
      if (conflict) {
        return {
          success: false,
          ...PhotoService.describeVariantConflict(conflict, { manufacturerCode, colorCode, colorName }),
        };
      }

      const photoUrls = await PhotoService.storePhotos({
        manufacturerCode,
        colorCode,
        photos: Array.isArray(newData.photos)
          ? newData.photos
          : current.photos.map((photo) => photo.url),
      });

      await MySQLDB.catalogTransaction(async (query) => {
        await PhotoRepository.upsertManufacturer(
          {
            manufacturerCode,
            resalePrice: PhotoService.parsePrice(newData.resale_price ?? current.resale_price),
            description: newData.description ?? current.description ?? "",
          },
          query,
        );
        const idColor = await PhotoRepository.findOrCreateColor({ colorCode, colorName }, query);
        await PhotoRepository.updateProduct(id, { manufacturerCode, packing, idColor }, query);
        await PhotoRepository.replacePhotos(id, photoUrls, query);
      });

      await PhotoService.clearImageCache();

      return { success: true, data: await PhotoRepository.findProductById(id) };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error:
          error.code === "ER_DUP_ENTRY"
            ? "Já existe um produto com essa referência, cor e embalagem."
            : error.message,
        message: "An error occurred while updating the photo.",
      };
    }
  }

  /**
   * Cria um produto (variação de cor) por item de `newPhotos`, reaproveitando os dados da
   * referência quando ela já existe.
   * @param {NewPhotosPayload} payload
   */
  static async createPhoto(payload) {
    const {
      newManufacturerCode,
      newPackaging,
      newResalePrice,
      newDescription,
      newPhotos: photosToCreate = [],
      newIsEva = false,
    } = payload;

    try {
      const manufacturerCode = String(newManufacturerCode ?? "").trim();
      PhotoService.assertKeySegment(manufacturerCode, "Referência");

      const responses = [];

      for (const photoData of photosToCreate) {
        try {
          const colorCode = PhotoService.normalizeCode(photoData.colorCode);
          const colorName = PhotoService.normalizeCode(photoData.color);
          PhotoService.assertKeySegment(colorCode, "Código da cor");
          if (!colorName) throw new Error("O nome da cor é obrigatório.");

          const existingProduct = await PhotoRepository.findProductByVariant({
            manufacturerCode,
            colorCode,
            colorName,
          });
          if (existingProduct) {
            responses.push({
              success: false,
              ...PhotoService.describeVariantConflict(existingProduct, {
                manufacturerCode,
                colorCode,
                colorName,
              }),
            });
            continue;
          }

          const manufacturer = await PhotoRepository.findManufacturer(manufacturerCode);
          const packing = (
            (await PhotoRepository.findPackingByManufacturer(manufacturerCode)) ||
            String(newPackaging ?? "")
          ).toLowerCase();
          if (!PACKING_VALUES.includes(packing)) {
            throw new Error("Selecione a embalagem do produto.");
          }

          const photoUrls = await PhotoService.storePhotos({
            manufacturerCode,
            colorCode,
            photos: photoData.photo || [],
            isEva: newIsEva,
          });

          const idProduct = await MySQLDB.catalogTransaction(async (query) => {
            await PhotoRepository.insertManufacturerIfMissing(
              {
                manufacturerCode,
                resalePrice: manufacturer
                  ? Number(manufacturer.resale_price)
                  : PhotoService.parsePrice(newResalePrice),
                description: manufacturer?.description ?? newDescription ?? "",
              },
              query,
            );
            const idColor = await PhotoRepository.findOrCreateColor({ colorCode, colorName }, query);
            const createdId = await PhotoRepository.insertProduct(
              { manufacturerCode, packing, idColor },
              query,
            );
            await PhotoRepository.replacePhotos(createdId, photoUrls, query);
            return createdId;
          });

          responses.push({
            success: true,
            data: await PhotoRepository.findProductById(idProduct),
          });
        } catch (error) {
          console.log(error);
          responses.push({ success: false, error: error.message });
        }
      }

      await PhotoService.clearImageCache();

      return {
        success: responses.length > 0 && responses.every((response) => response.success),
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
   * Baixa as fotos dos produtos já redimensionadas.
   * @param {Array<CatalogProduct>} products
   * @returns {Promise<{success: boolean, data?: Array<CatalogProduct & {files: Array<Buffer>}>, error?: string}>}
   */
  static async resizePhotos(products) {
    try {
      const processedProducts = [];
      for (const product of products) {
        const files = [];
        for (let i = 0; i < product.photos.length; i++) {
          const buffer = await PhotosApiService.fetchPhoto(product.photos[i].url);
          files.push(await PhotoService.processPhoto(buffer, i));
        }
        processedProducts.push({ ...product, files });
      }
      return { success: true, data: processedProducts };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while resizing photos.",
      };
    }
  }

  /**
   * @param {{productIds: Array<number>}} args
   */
  static async downloadPhoto(args) {
    const productIds = (args.productIds || []).map(Number).filter(Number.isInteger);
    try {
      if (productIds.length === 0) {
        return { success: false, message: "Nenhum produto selecionado." };
      }

      const result = await dialog.showOpenDialog({
        title: "Escolha a pasta para salvar as fotos",
        properties: ["openDirectory"],
      });

      if (result.canceled || !result.filePaths.length) {
        return { success: false, message: "Operação cancelada pelo usuário." };
      }

      const products = await PhotoRepository.findProducts({ ids: productIds });
      const resized = await PhotoService.resizePhotos(products);
      if (!resized.success) return resized;

      const folderPath = result.filePaths[0];
      for (const product of resized.data) {
        const productDir = path.join(folderPath, product.manufacturer_code);
        fs.mkdirSync(productDir, { recursive: true });
        product.files.forEach((file, index) => {
          fs.writeFileSync(
            path.join(
              productDir,
              `${product.manufacturer_code}_${product.color_code}_${index + 1}.jpg`,
            ),
            file,
          );
        });
      }

      return { success: true, message: "Fotos baixadas com sucesso." };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.message,
        message: "Ocorreu um erro ao baixar as fotos.",
      };
    }
  }

  /** Remove o produto e suas fotos do catálogo (os arquivos permanecem no bucket). */
  static async deletePhoto(productId) {
    try {
      const deleted = await PhotoRepository.deleteProduct(Number(productId));
      if (!deleted) return { success: false, error: "Produto não encontrado." };
      return { success: true, message: "Photo deleted successfully." };
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
