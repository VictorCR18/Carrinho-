import { Request, Response, NextFunction } from "express";
import { TokenProvider } from "../providers/TokenProvider";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Faça login antes de continuar." });

  const [, token] = authHeader.split(" ");
  const decoded = TokenProvider.verificarToken(token);

  if (!decoded) return res.status(401).json({ error: "Token inválido" });

  req.user = decoded;

  return next();
};
