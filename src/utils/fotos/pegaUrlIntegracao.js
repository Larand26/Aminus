const pegaUrlIntegracao = (url) => {
  if (!url) return "https://www.youtube.com/embed/";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/,
  );
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
};

export default pegaUrlIntegracao;
