import express from "express";
import {
  getProductionReport,
  getReorderReport,
  getMaterialUsageReport,
  getProfitReport,
} from "../controllers/reportController.js";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

// ===============================
// ANALYTICS & REPORTING
// ===============================

// production report (date range)
router.get("/production", auth, getProductionReport);

// low stock reorder suggestions
router.get("/reorder", auth, getReorderReport);

// material usage analytics
router.get("/materials", auth, getMaterialUsageReport);

// profit report (admin only)
router.get("/profit", auth, admin, getProfitReport);

export default router;