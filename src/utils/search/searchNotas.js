const searchNotas = (filters) => {
  if (!filters) return [];
  if (Object.values(filters).every((value) => !value)) return [];

  window.electronApi?.searchNota(filters);

  const response = new Promise((resolve) => {
    window.electronApi?.onSearchNotaResponse((arg) => {
      resolve(arg);
    });
  });
  return response;
};
export default searchNotas;
