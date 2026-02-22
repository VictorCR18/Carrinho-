import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "chave_padrao_desenvolvimento";

export class TokenProvider {
  static gerarToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1d",
    });
  }

  static verificarToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
}
