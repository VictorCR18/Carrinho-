import { Router } from "express";
import produtoRouter from "./Produto";
import usuarioRouter from "./Usuario";
import pedidoRouter from "./Pedido";
import dashboardRouter from "./Dashboard";

const router = Router();

router.use(produtoRouter);
router.use(usuarioRouter);
router.use(pedidoRouter);
router.use(dashboardRouter);

export default router;
