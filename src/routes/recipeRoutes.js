import express from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";

import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// ===============================
// PRODUCT RECIPES (BOM)
// ===============================

// get all recipes (any authenticated user)
router.get("/", protectRoute, getRecipes);

// get single recipe
router.get("/:id", protectRoute, getRecipeById);

// create recipe (admin only)
router.post("/", protectRoute, adminOnly, createRecipe);

// update recipe (admin only)
router.put("/:id", protectRoute, adminOnly, updateRecipe);

// delete recipe (admin only)
router.delete("/:id", protectRoute, adminOnly, deleteRecipe);

export default router;