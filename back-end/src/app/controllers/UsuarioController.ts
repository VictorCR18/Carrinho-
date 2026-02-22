import { Request, Response } from "express";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import { TokenProvider } from "../../shared/providers/TokenProvider";
import bcrypt from "bcrypt";

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

  async updateProfile(req: Request, res: Response) {
    const id = req.user.id;
    const { nome, email, senha } = req.body;

    try {
      const dadosParaAtualizar: any = { nome, email };

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
      return res.status(500).json({ error: "Erro ao atualizar seu perfil." });
    }
  }

  async deleteSelf(req: Request, res: Response) {
    const id = req.user.id;

    try {
      await repository.delete(Number(id));
      return res.json({ message: "Sua conta foi excluída com sucesso." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao excluir sua conta." });
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

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (Number(req.user.id) === Number(id)) {
      return res.status(400).json({
        error:
          "Use a rota de exclusão de perfil para deletar sua própria conta.",
      });
    }

    try {
      await repository.delete(Number(id));
      return res.json({ message: "Usuário excluído com sucesso." });
    } catch (error) {
      return res.status(404).json({ error: "Usuário não encontrado." });
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

  async mudarSenha(req: Request, res: Response) {
    const id = req.user.id;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ error: "As senhas são obrigatórias." });
    }

    try {
      const usuario = await repository.findById(Number(id));
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: "A senha atual está incorreta." });
      }

      const salt = await bcrypt.genSalt(10);
      const novaSenhaCriptografada = await bcrypt.hash(novaSenha, salt);

      await repository.update(Number(id), {
        senha: novaSenhaCriptografada,
        nome: "",
        email: "",
        role: "USER"
      });

      return res.json({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar senha." });
    }
  }
}
