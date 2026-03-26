import express from "express";
import {
  getProductionReport,
  getReorderReport,
  getMaterialUsageReport,
  getProfitReport,
} from "../controllers/reportController.js";

import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// ===============================
// ANALYTICS & REPORTING
// ===============================

// production report (date range) - any authenticated user
router.get("/production", protectRoute, getProductionReport);

// low stock / reorder suggestions - any authenticated user
router.get("/reorder", protectRoute, getReorderReport);

// material usage analytics - any authenticated user
router.get("/materials", protectRoute, getMaterialUsageReport);

// profit report - admin only
router.get("/profit", protectRoute, adminOnly, getProfitReport);

export default router;