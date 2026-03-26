import express from "express";
import {
  getProductionPlans,
  createProductionPlan,
  updateProductionPlan,
  deleteProductionPlan,
  markPlanCompleted,
} from "../controllers/planController.js";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

// ===============================
// PRODUCTION PLANNING CALENDAR
// ===============================

// list all plans
router.get("/", auth, getProductionPlans);

// create plan
router.post("/", auth, admin, createProductionPlan);

// update plan
router.put("/:id", auth, admin, updateProductionPlan);

// delete plan
router.delete("/:id", auth, admin, deleteProductionPlan);

// mark plan completed
router.put("/:id/complete", auth, admin, markPlanCompleted);

export default router;