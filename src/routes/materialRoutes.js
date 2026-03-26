import express from "express";
import {
  getRawMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  restockMaterial,
} from "../controllers/materialController.js";

import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// ===============================
// RAW MATERIAL INVENTORY
// ===============================

// get all materials (any authenticated user)
router.get("/", protectRoute, getRawMaterials);

// get single material
router.get("/:id", protectRoute, getMaterialById);

// create new material (admin only)
router.post("/", protectRoute, adminOnly, createMaterial);

// update material details (admin only)
router.put("/:id", protectRoute, adminOnly, updateMaterial);

// delete material (admin only)
router.delete("/:id", protectRoute, adminOnly, deleteMaterial);

// restock material (adds quantity + logs purchase) (admin only)
router.post("/:id/restock", protectRoute, adminOnly, restockMaterial);

export default router;