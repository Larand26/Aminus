import JSZip from "jszip";

// Função auxiliar para redimensionar imagem base64
const resizeImage = (base64, isFirstImage, maxSize = 800) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const scale = Math.min(maxSize / width, maxSize / height, 1);
      const newWidth = Math.round(width * scale);
      const newHeight = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (isFirstImage) {
        // Para a primeira imagem, cria um canvas de 800x800 com fundo branco
        canvas.width = maxSize;
        canvas.height = maxSize;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, maxSize, maxSize);

        // Centraliza a imagem redimensionada no canvas
        const x = (maxSize - newWidth) / 2;
        const y = (maxSize - newHeight) / 2;
        ctx.drawImage(img, x, y, newWidth, newHeight);
      } else {
        // Para as outras imagens, redimensiona normalmente
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
      }

      resolve(canvas.toDataURL("image/jpeg").split(",")[1]); // retorna apenas o base64
    };
    img.src = `data:image/jpeg;base64,${base64}`;
  });

const baixaFotos = async (fotos, referencia) => {
  console.log(fotos);
  /*
    fotos = [{fotos: [<foto1>, <foto2>, ...]}, ...]
    Cada foto: { referencia, codigo_cor, buffer }
  */
  if (!fotos || fotos.length === 0)
    return { success: false, message: "Nenhuma foto para baixar." };

  const zip = new JSZip();
  for (const foto of fotos) {
    let i = 1;
    for (const [key, base64] of Object.entries(foto.fotos)) {
      if (!base64) continue;
      const nomeArquivo = `${foto.referencia}_${foto.codigo_cor}_${i}.jpg`;
      // Passa 'true' se for a primeira imagem (i === 1), senão 'false'
      const resizedBase64 = await resizeImage(base64, i === 1, 800);
      zip.file(nomeArquivo, resizedBase64, { base64: true });
      i++;
    }
  }

  // Gera o ZIP como Blob para download no navegador
  const zipBlob = await zip.generateAsync({ type: "blob" });

  if (zipBlob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${referencia || fotos[0].referencia}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    success: true,
    message: "Fotos baixadas com sucesso.",
  };
};

export default baixaFotos;
