import express from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

// ===============================
// PRODUCT RECIPES (BOM)
// ===============================

// get all recipes
router.get("/", auth, getRecipes);

// get single recipe
router.get("/:id", auth, getRecipeById);

// create recipe
router.post("/", auth, admin, createRecipe);

// update recipe
router.put("/:id", auth, admin, updateRecipe);

// delete recipe
router.delete("/:id", auth, admin, deleteRecipe);

export default router;