import JSZip from "jszip";

const baixaFotos = async (fotos, referencia) => {
  /*
    fotos = [{fotos: [<foto1>, <foto2>, ...]}, ...]
    Cada foto: { referencia, codigo_cor, buffer }
  */
  if (!fotos || fotos.length === 0)
    return { success: false, message: "Nenhuma foto para baixar." };

  const zip = new JSZip();
  fotos.forEach((foto) => {
    Object.entries(foto.fotos).forEach(([key, base64], index) => {
      if (!base64) return;
      const nomeArquivo = `${foto.referencia}_${foto.codigo_cor}_${
        index + 1
      }.jpg`;
      zip.file(nomeArquivo, base64, { base64: true });
    });
  });

  // Gera o ZIP como Blob para download no navegador
  const zipBlob = await zip.generateAsync({ type: "blob" });

  if (zipBlob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${referencia || "Sem Referencia"}.zip`;
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
