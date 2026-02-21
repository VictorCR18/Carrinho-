import { Router } from "express";
import { UsuarioController } from "../../app/controllers/UsuarioController";

const router = Router();
const controller = new UsuarioController();

router.post("/usuarios/registrar", controller.registrar);
router.post("/usuarios/login", controller.login);

// router.get("/usuarios", controller.getAll);
// router.get("/usuarios/:id", controller.getById);
// // Opcional: router.post("/usuarios", controller.create); -> Geralmente o "registrar" já faz esse papel
// router.put("/usuarios/:id", controller.update);
// router.delete("/usuarios/:id", controller.delete);

export default router;
