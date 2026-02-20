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

  async adicionarEstoque(req: Request, res: Response) {
    const { id } = req.params;
    const { quantidade } = req.body;

    if (!quantidade || quantidade <= 0) {
      return res
        .status(400)
        .json({
          error: "A quantidade a ser adicionada deve ser maior que zero.",
        });
    }

    try {
      const produto = await repository.findById(Number(id));
      if (!produto)
        return res.status(404).json({ error: "Produto não encontrado" });

      const produtoAtualizado = await repository.update(Number(id), {
        ...produto,
        descricao: produto.descricao ?? undefined,
        imagem: produto.imagem ?? undefined,
        quantidade: produto.quantidade + quantidade,
      });

      res.json(produtoAtualizado);
    } catch (err) {
      res.status(500).json({ error: "Erro ao adicionar estoque" });
    }
  }

  async diminuirEstoque(req: Request, res: Response) {
    const { id } = req.params;
    const { quantidade } = req.body;

    if (!quantidade || quantidade <= 0) {
      return res
        .status(400)
        .json({
          error: "A quantidade a ser removida deve ser maior que zero.",
        });
    }

    try {
      const produto = await repository.findById(Number(id));
      if (!produto)
        return res.status(404).json({ error: "Produto não encontrado" });

      if (produto.quantidade < quantidade) {
        return res
          .status(400)
          .json({ error: "Estoque insuficiente para realizar esta operação." });
      }

      const produtoAtualizado = await repository.update(Number(id), {
        ...produto,
        descricao: produto.descricao ?? undefined,
        imagem: produto.imagem ?? undefined,
        quantidade: produto.quantidade - quantidade,
      });

      res.json(produtoAtualizado);
    } catch (err) {
      res.status(500).json({ error: "Erro ao diminuir estoque" });
    }
  }

  async checkout(req: Request, res: Response) {
    const { itens } = req.body;

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res
        .status(400)
        .json({ error: "Nenhum item enviado no carrinho." });
    }

    try {
      for (const item of itens) {
        const produto = await repository.findById(Number(item.id));
        if (!produto) {
          return res
            .status(404)
            .json({ error: `O produto com ID ${item.id} não foi encontrado.` });
        }
        if (produto.quantidade < item.quantidade) {
          return res
            .status(400)
            .json({
              error: `Estoque insuficiente para o produto: ${produto.nome}.`,
            });
        }
      }

      const produtosAtualizados = [];
      for (const item of itens) {
        const produto = await repository.findById(Number(item.id));
        if (produto) {
          const atualizado = await repository.update(Number(item.id), {
            ...produto,
            descricao: produto.descricao ?? undefined,
            imagem: produto.imagem ?? undefined,
            quantidade: produto.quantidade - item.quantidade,
          });
          produtosAtualizados.push(atualizado);
        }
      }

      res.status(200).json({
        message: "Compra finalizada com sucesso! Estoques atualizados.",
        produtos: produtosAtualizados,
      });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao processar a finalização da compra." });
    }
  }
}
