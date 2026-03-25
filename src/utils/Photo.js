import Utils from "./Utils";

class Photo {
  static async getPhotos(args) {
    const { token, filters } = args;
    try {
      const response = await window.api.getPhotos({ token, filters });
      if (response.success) {
        response.data.map((product) => {
          product.fotos = product.fotos.map((foto) =>
            Utils.bufferToBase64(foto.buffer),
          );
          return product;
        });
        return {
          success: true,
          data: response.data,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while fetching products.",
      };
    }
  }

  static async updatePhoto(args) {
    const { token, oldProduct, newProduct } = args;
    try {
      // Função utilitária para comparar campos relevantes
      function compareFields(objA, objB, fieldPairs) {
        return fieldPairs.every(([a, b]) => objA[a] === objB[b]);
      }

      const fieldPairs = [
        ["description", "descricao_produto"],
        ["colorName", "nome_cor"],
        ["colorCode", "codigo_cor"],
        ["resalePrice", "preco_revenda"],
        ["manufacturer", "referencia"],
        ["packaging", "embalamento"],
        ["videoUrl", "video_url"],
      ];

      const fieldsEqual = compareFields(newProduct, oldProduct, fieldPairs);
      const photosEqual = Utils.arePhotoArraysEqual(
        oldProduct.fotos,
        newProduct.photos,
      );

      if (fieldsEqual && photosEqual) {
        return {
          success: true,
          message: "No changes detected. The product was not updated.",
        };
      }

      const newData = {
        descricao_produto: newProduct.description,
        nome_cor: newProduct.colorName,
        codigo_cor: newProduct.colorCode,
        preco_revenda: newProduct.resalePrice,
        referencia: newProduct.manufacturer,
        embalamento: newProduct.packaging,
        video_url: newProduct.videoUrl,
        fotos: newProduct.photos.map((photo) => Utils.base64ToBuffer(photo)),
      };

      const response = await window.api.updatePhoto({
        token,
        id: oldProduct._id,
        newData,
      });

      if (response.success) {
        return {
          success: true,
          message: "Product updated successfully.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "An error occurred while updating the product.",
      };
    }
  }
}
export default Photo;
