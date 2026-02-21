import { Router } from "express";
import produtoRouter from "./Produto";
import usuarioRouter from "./Usuario";

const router = Router();

router.use(produtoRouter);
router.use(usuarioRouter);

export default router;