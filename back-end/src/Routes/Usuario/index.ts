import { Router } from "express";
import { UsuarioController } from "../../app/controllers/UsuarioController";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";

const router = Router();
const controller = new UsuarioController();

// Públicas
router.post("/usuarios/registrar", controller.registrar);
router.post("/usuarios/login", controller.login);

// Privadas (Exigem login)
router.get("/usuarios/:id", ensureAuthenticated, controller.getById);
router.put("/usuarios/:id", ensureAuthenticated, controller.update);

router.get("/usuarios", ensureAuthenticated, controller.getAll);
router.delete("/usuarios/:id", ensureAuthenticated, controller.delete);

export default router;
