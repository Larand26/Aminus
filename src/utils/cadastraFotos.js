const cadastraFotos = async (files, prod) => {
  //Coverte files para base64
  const convertToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };
  if (!files) return;

  // Validação dos campos obrigatórios
  if (!prod.referencia || !prod.codigo_cor) {
    return {
      success: false,
      message: "Referência e código da cor são obrigatórios.",
    };
  }

  const fotos = {
    foto_principal: files[0] ? await convertToBase64(files[0]) : null,
    foto_produto_1: files[1] ? await convertToBase64(files[1]) : null,
    foto_produto_2: files[2] ? await convertToBase64(files[2]) : null,
    foto_produto_3: files[3] ? await convertToBase64(files[3]) : null,
    foto_produto_4: files[4] ? await convertToBase64(files[4]) : null,
    foto_produto_5: files[5] ? await convertToBase64(files[5]) : null,
    foto_complementar: null,
  };
  const produto = {
    referencia: prod.referencia,
    codigo_cor: prod.codigo_cor,
    preco: prod.preco,
    embalagem: prod.embalagem,
    fotos: fotos,
    descricao_produto: prod.descricao_produto,
    nome_cor: prod.nome_cor,
  };

  window.electronApi?.cadastraFotos(produto);
  const result = await window.electronApi?.onCadastraFotosResponse(
    (response) => {
      return response;
    }
  );
  return result;
};

export default cadastraFotos;
