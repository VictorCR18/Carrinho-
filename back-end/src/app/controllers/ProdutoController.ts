import { Request, Response } from "express";
import { ProdutoRepository } from "../repository/ProdutoRepository";
import prisma from "@/config/database/connection";

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
    const usuarioId = req.user.id;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        let totalGeral = 0;

        const pedido = await tx.pedido.create({
          data: {
            usuarioId: Number(usuarioId),
            total: 0,
          },
        });

        for (const item of itens) {
          const produto = await tx.produto.findUnique({
            where: { id: item.id },
          });

          if (!produto || produto.quantidade < item.quantidade) {
            throw new Error(
              `Estoque insuficiente: ${produto?.nome || "Produto desconhecido"}`,
            );
          }

          await tx.produto.update({
            where: { id: produto.id },
            data: { quantidade: produto.quantidade - item.quantidade },
            include: {
              itens: {
                include: { produto: true },
              },
            },
          });

          await tx.itemPedido.create({
            data: {
              pedidoId: pedido.id,
              produtoId: produto.id,
              quantidade: item.quantidade,
              precoUnitario: produto.preco,
            },
          });

          totalGeral += produto.preco * item.quantidade;
        }

        return await tx.pedido.update({
          where: { id: pedido.id },
          data: { total: totalGeral },
        });
      });

      res.status(201).json(resultado);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
