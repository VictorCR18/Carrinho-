import { Router } from "express";
import { UsuarioController } from "../../app/controllers/UsuarioController";
import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";

const router = Router();
const controller = new UsuarioController();

router.post("/usuarios/registrar", controller.registrar);
router.post("/usuarios/login", controller.login);

// --- ROTAS DO PERFIL (O próprio usuário logado) ---
router.put("/usuarios/perfil", ensureAuthenticated, controller.updateProfile);
router.delete("/usuarios/perfil", ensureAuthenticated, controller.deleteSelf);

// --- ROTAS ADMINISTRATIVAS (Ou busca por ID específico) ---
router.get("/usuarios/:id", ensureAuthenticated, controller.getById);
router.put("/usuarios/:id", ensureAuthenticated, controller.update); 

router.get("/usuarios", ensureAuthenticated, controller.getAll);
router.delete("/usuarios/:id", ensureAuthenticated, controller.delete);

export default router;
