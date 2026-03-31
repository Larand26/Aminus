import JwtService from "../services/JwtService";

class MiddlewaresToken {
  static async verifyToken(token) {
    try {
      const isValid = await JwtService.isTokenValid(token);
      return isValid;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async decodeToken(token) {
    try {
      const decoded = await JwtService.verifyToken(token);
      return decoded;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default MiddlewaresToken;
