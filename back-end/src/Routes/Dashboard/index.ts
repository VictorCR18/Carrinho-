import { ensureAuthenticated } from "../../shared/middlewares/ensureAuthenticated";
import { DashboardController } from "../../app/controllers/DashboardController";
import { Router } from "express";

export const router = Router();

const dashboardController = new DashboardController();

router.get(
  "/admin/dashboard",
  ensureAuthenticated,
  dashboardController.getResumo,
);
