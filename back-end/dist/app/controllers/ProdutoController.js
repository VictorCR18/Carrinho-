"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoController = void 0;
const ProdutoRepository_1 = require("@/app/repository/ProdutoRepository");
const repository = new ProdutoRepository_1.ProdutoRepository();
class ProdutoController {
    async getAll(req, res) {
        const produtos = await repository.findAll();
        res.json(produtos);
    }
    async getById(req, res) {
        const { id } = req.params;
        const produto = await repository.findById(Number(id));
        if (!produto)
            return res.status(404).json({ error: "Produto não encontrado" });
        res.json(produto);
    }
    async create(req, res) {
        const novo = await repository.create(req.body);
        res.status(201).json(novo);
    }
    async update(req, res) {
        const { id } = req.params;
        try {
            const produto = await repository.update(Number(id), req.body);
            res.json(produto);
        }
        catch (err) {
            res.status(404).json({ error: "Produto não encontrado" });
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            await repository.delete(Number(id));
            res.json({ message: "Produto deletado com sucesso" });
        }
        catch (err) {
            res.status(404).json({ error: "Produto não encontrado" });
        }
    }
}
exports.ProdutoController = ProdutoController;
