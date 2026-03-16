import jwt from "jsonwebtoken";

class JwtService {
  /**
   * Gerar um token JWT para um usuário
   * @param {Object} user { ID: number, NOME: string, ID_FUNCAO_USUARIO: number }
   * @returns {Promise<string>} O token JWT gerado
   */
  static async generateToken(user) {
    return jwt.sign(
      {
        id: user.ID,
        username: user.NOME,
        role: user.ID_FUNCAO_USUARIO,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
    );
  }
  static async verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  /**
   * Verificar se o token JWT é válido
   * @param {string} token
   * @returns {Promise<{ valid: boolean, decoded?: Object, error?: string }>}
   */
  static async isTokenValid(token) {
    try {
      const decoded = await this.verifyToken(token);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

export default JwtService;
