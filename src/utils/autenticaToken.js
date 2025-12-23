const autenticaToken = async (token) => {
  if (!token) {
    return { success: false, error: "Token não fornecido" };
  }

  window.electronApi?.autenticaToken(token);

  const response = new Promise((resolve) => {
    window.electronApi?.onAutenticaTokenResponse((arg) => {
      resolve(arg);
    });
  });

  return response;
};

export default autenticaToken;
