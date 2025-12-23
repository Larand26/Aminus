const jwt = require("jsonwebtoken");
const path = require("path");
const globals = require(path.join(__dirname, "../globals"));

const SECRET = globals.JWT_SECRET;

const verificaToken = async (token) => {
  if (!token) {
    return { success: false, error: "Token não fornecido" };
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    return { success: true, data: decoded };
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return { success: false, error: "Token inválido ou expirado" };
  }
};

module.exports = { verificaToken };
