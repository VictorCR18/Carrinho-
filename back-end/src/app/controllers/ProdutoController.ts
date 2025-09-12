import { Request, Response } from "express";
import { ProdutoRepository } from "@/app/repository/ProdutoRepository";

const repository = new ProdutoRepository();

export class ProdutoController {
  async getAll(req: Request, res: Response) {
    const produtos = await repository.findAll();
    res.json(produtos);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const produto = await repository.findById(Number(id));
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
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
}
