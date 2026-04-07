import { ProductRecipe } from "../models/ProductRecipe.js";

export const getRecipes = async (req, res) => {
  try {
    const recipes = await ProductRecipe.find().populate("materials.material");
    res.json(recipes);
  } catch (err) {
    console.error("Get recipes error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await ProductRecipe.findById(req.params.id).populate(
      "materials.material"
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (err) {
    console.error("Get recipe error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const recipe = await ProductRecipe.create(req.body);
    res.status(201).json(recipe);
  } catch (err) {
    console.error("Create recipe error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const recipe = await ProductRecipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(recipe);
  } catch (err) {
    console.error("Update recipe error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    await ProductRecipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    console.error("Delete recipe error:", err);
    res.status(500).json({ message: err.message });
  }
};