import express from "express";
import {
  getProductionPlans,
  createProductionPlan,
  updateProductionPlan,
  deleteProductionPlan,
  markPlanCompleted,
} from "../controllers/planController.js";

import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// ===============================
// PRODUCTION PLANNING CALENDAR
// ===============================

// list all plans (any authenticated user)
router.get("/", protectRoute, getProductionPlans);

// create plan (admin only)
router.post("/", protectRoute, adminOnly, createProductionPlan);

// update plan (admin only)
router.put("/:id", protectRoute, adminOnly, updateProductionPlan);

// delete plan (admin only)
router.delete("/:id", protectRoute, adminOnly, deleteProductionPlan);

// mark plan completed (admin only)
router.put("/:id/complete", protectRoute, adminOnly, markPlanCompleted);

export default router;