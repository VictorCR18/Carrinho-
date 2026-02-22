import { Router } from "express";
import { PedidoController } from "../../app/controllers/PedidoController";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";

const router = Router();
const controller = new PedidoController();

router.get(
  "/pedidos/meus-pedidos",
  ensureAuthenticated,
  controller.listarMeusPedidos,
);
router.get("/pedidos/:id", ensureAuthenticated, controller.detalhesPedido);

export default router;
