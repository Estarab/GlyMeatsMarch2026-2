import express from "express";
import {
  createProductionBatch,
  getProductionHistory,
  getProductionBatchById,
  deleteProductionBatch,
} from "../controllers/productionController.js";

// updated middleware imports
import {
  protectRoute,
  adminOnly,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// ===============================
// PRODUCTION EXECUTION
// ===============================

// create a production batch (admin only)
router.post("/produce", protectRoute, adminOnly, createProductionBatch);

// list all production batches
router.get("/history", protectRoute, getProductionHistory);

// get single batch details
router.get("/:id", protectRoute, getProductionBatchById);

// delete batch (admin only)
router.delete("/:id", protectRoute, adminOnly, deleteProductionBatch);

export default router;