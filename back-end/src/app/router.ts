import { Router } from "express";
import { ProdutoController } from "./controllers/ProdutoController";

const router = Router();
const controller = new ProdutoController();

router.get("/produtos", controller.getAll);
router.get("/produtos/:id", controller.getById);
router.post("/produtos", controller.create);
router.put("/produtos/:id", controller.update);
router.delete("/produtos/:id", controller.delete);

export default router;
