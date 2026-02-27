import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { DashboardController } from "../../app/controllers/DashboardController";
import e, { Router } from "express";

export const router = Router();

const dashboardController = new DashboardController();

router.get(
  "/admin/dashboard",
  ensureAuthenticated,
  dashboardController.getResumo,
);

export default router;
