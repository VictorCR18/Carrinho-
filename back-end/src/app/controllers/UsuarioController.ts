import { Request, Response } from "express";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const repository = new UsuarioRepository();
const JWT_SECRET = process.env.JWT_SECRET || "chave_padrao_desenvolvimento";

export class UsuarioController {

  async registrar(req: Request, res: Response) {
    const { nome, email, senha, role } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Nome, e-mail e senha são obrigatórios." });
    }

    try {
      const usuarioExistente = await repository.findByEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ error: "Este e-mail já está em uso." });
      }

      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      const novoUsuario = await repository.create({
        nome,
        email,
        senha: senhaCriptografada,
        role: role || "USER", 
      });

      const { senha: _, ...usuarioSemSenha } = novoUsuario;

      res.status(201).json(usuarioSemSenha);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno ao registrar usuário." });
    }
  }

  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ error: "E-mail e senha são obrigatórios." });
    }

    try {
      const usuario = await repository.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: "E-mail ou senha inválidos." });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: "E-mail ou senha inválidos." });
      }

      const token = jwt.sign(
        { id: usuario.id, role: usuario.role },
        JWT_SECRET,
        { expiresIn: "1d" },
      );

      const { senha: _, ...usuarioSemSenha } = usuario;

      res.status(200).json({
        message: "Login realizado com sucesso!",
        token,
        usuario: usuarioSemSenha,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno ao fazer login." });
    }
  }
}
