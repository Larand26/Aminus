const jwt = require("jsonwebtoken");
const path = require("path");
const globals = require(path.join(__dirname, "../globals"));

const SECRET = globals.JWT_SECRET;

const geraToken = async (payload, semExpiracao) => {
  if (semExpiracao) {
    return { success: true, data: jwt.sign(payload, SECRET) };
  }
  return {
    success: true,
    data: jwt.sign(payload, SECRET, { expiresIn: "8h" }),
  };
};

module.exports = { geraToken };
