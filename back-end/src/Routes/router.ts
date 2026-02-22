import { Router } from "express";
import produtoRouter from "./Produto";
import usuarioRouter from "./Usuario";
import pedidoRouter from "./Pedido";

const router = Router();

router.use(produtoRouter);
router.use(usuarioRouter);
router.use(pedidoRouter);

export default router;
