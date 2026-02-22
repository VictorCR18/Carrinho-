import { Request, Response } from "express";
import { PedidoRepository } from "../repository/PedidoRepository";

const repository = new PedidoRepository();

export class PedidoController {
  async listarMeusPedidos(req: Request, res: Response) {
    try {
      const usuarioId = req.user.id;

      const pedidos = await repository.findByUsuario(Number(usuarioId));

      return res.json(pedidos);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar histórico de pedidos." });
    }
  }

  async detalhesPedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id;

      const pedido = await repository.findById(Number(id));

      if (!pedido) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }

      if (pedido.usuarioId !== Number(usuarioId)) {
        return res.status(403).json({ error: "Acesso negado a este pedido." });
      }

      return res.json(pedido);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao buscar detalhes do pedido." });
    }
  }
}
