import { Router } from "express";
import { ProdutoController } from "../../app/controllers/ProdutoController";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated"; 

const router = Router();
const controller = new ProdutoController();

// --- ROTAS PÚBLICAS
router.get("/produtos", controller.getAll);
router.get("/produtos/:id", controller.getById);

// --- ROTAS PROTEGIDAS

// O usuário só pode comprar se estiver logado
router.post("/checkout", ensureAuthenticated, controller.checkout);

// Rotas de gerenciamento
router.post("/produtos", ensureAuthenticated, controller.create);
router.put("/produtos/:id", ensureAuthenticated, controller.update);
router.delete("/produtos/:id", ensureAuthenticated, controller.delete);

export default router;
