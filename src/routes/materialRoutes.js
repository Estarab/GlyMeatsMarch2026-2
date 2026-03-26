import express from "express";
import {
  getRawMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  restockMaterial,
} from "../controllers/materialController.js";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

// ===============================
// RAW MATERIAL INVENTORY
// ===============================

// get all materials
router.get("/", auth, getRawMaterials);

// get single material
router.get("/:id", auth, getMaterialById);

// create new material
router.post("/", auth, admin, createMaterial);

// update material details
router.put("/:id", auth, admin, updateMaterial);

// delete material
router.delete("/:id", auth, admin, deleteMaterial);

// restock material (adds quantity + logs purchase)
router.post("/:id/restock", auth, admin, restockMaterial);

export default router;