const searchFotos = async (filters) => {
  if (!filters) {
    return { success: false, error: "Nenhum filtro fornecido." };
  }
  if (Object.values(filters).every((value) => !value)) {
    return { success: false, error: "Nenhum filtro fornecido." };
  }
  console.log(filters);

  window.electronApi?.searchFoto(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchFotoResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};
export default searchFotos;
