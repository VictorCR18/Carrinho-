import { Request, Response } from "express";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import { TokenProvider } from "../../shared/providers/TokenProvider";
import bcrypt from "bcrypt";
import prisma from "@/config/database/connection";

const repository = new UsuarioRepository();

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
      return res.status(201).json(usuarioSemSenha);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro interno ao registrar usuário." });
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

      if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        return res.status(401).json({ error: "E-mail ou senha inválidos." });
      }

      const token = TokenProvider.gerarToken({
        id: usuario.id,
        role: usuario.role,
      });

      const { senha: _, ...usuarioSemSenha } = usuario;

      return res.status(200).json({
        message: "Login realizado com sucesso!",
        token,
        usuario: usuarioSemSenha,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno ao fazer login." });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const usuarios = await repository.findAll();
      const usuariosSemSenha = usuarios.map(({ senha, ...resto }) => resto);
      return res.json(usuariosSemSenha);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar usuários." });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const usuario = await repository.findById(Number(id));
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
      const { senha: _, ...usuarioSemSenha } = usuario;
      return res.json(usuarioSemSenha);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar usuário." });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, email, senha, role } = req.body;

    try {
      const usuarioExistente = await repository.findById(Number(id));
      if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const dadosParaAtualizar: any = { nome, email, role };

      if (senha) {
        const salt = await bcrypt.genSalt(10);
        dadosParaAtualizar.senha = await bcrypt.hash(senha, salt);
      }

      const usuarioAtualizado = await repository.update(
        Number(id),
        dadosParaAtualizar,
      );
      const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;

      return res.json(usuarioSemSenha);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (req.user.id === id) {
      return res
        .status(400)
        .json({ error: "Você não pode excluir sua própria conta por aqui." });
    }

    try {
      await repository.delete(Number(id));
      return res.json({ message: "Usuário excluído com sucesso." });
    } catch (error) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
  }
}
