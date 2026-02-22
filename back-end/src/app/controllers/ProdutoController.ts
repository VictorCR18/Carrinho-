import { Request, Response } from "express";
import { ProdutoRepository } from "../repository/ProdutoRepository";

const repository = new ProdutoRepository();

export class ProdutoController {
  async getAll(req: Request, res: Response) {
    const produtos = await repository.findAll();
    res.json(produtos);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const produto = await repository.findById(Number(id));
    if (!produto)
      return res.status(404).json({ error: "Produto não encontrado" });
    res.json(produto);
  }

  async create(req: Request, res: Response) {
    const novo = await repository.create(req.body);
    res.status(201).json(novo);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const produto = await repository.update(Number(id), req.body);
      res.json(produto);
    } catch (err) {
      res.status(404).json({ error: "Produto não encontrado" });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await repository.delete(Number(id));
      res.json({ message: "Produto deletado com sucesso" });
    } catch (err) {
      res.status(404).json({ error: "Produto não encontrado" });
    }
  }

  async checkout(req: Request, res: Response) {
    const { itens } = req.body;
    const usuarioId = req.user?.id;

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res
        .status(400)
        .json({ error: "Nenhum item enviado no carrinho." });
    }

    try {
      const validacoes = await Promise.all(
        itens.map(async (item) => {
          const produto = await repository.findById(Number(item.id));
          return { item, produto };
        }),
      );

      for (const { item, produto } of validacoes) {
        if (!produto) {
          return res
            .status(404)
            .json({ error: `O produto com ID ${item.id} não existe.` });
        }
        if (produto.quantidade < item.quantidade) {
          return res
            .status(400)
            .json({ error: `Estoque insuficiente para: ${produto.nome}.` });
        }
      }

      const produtosAtualizados = await Promise.all(
        validacoes.map(async ({ item, produto }) => {
          return await repository.update(Number(item.id), {
            ...produto!, 
            quantidade: produto!.quantidade - item.quantidade,
            descricao: produto!.descricao ?? undefined,
            imagem: produto!.imagem ?? undefined,
          });
        }),
      );

      res.status(200).json({
        message: `Compra finalizada com sucesso pelo usuário ${usuarioId}!`,
        produtos: produtosAtualizados,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Erro ao processar a finalização da compra." });
    }
  }
}
