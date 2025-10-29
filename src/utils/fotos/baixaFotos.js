import JSZip from "jszip";

// Função auxiliar para redimensionar imagem base64
const resizeImage = (base64, maxSize = 800) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const scale = Math.min(maxSize / width, maxSize / height, 1);
      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
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
      const resizedBase64 = await resizeImage(base64, 800);
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
