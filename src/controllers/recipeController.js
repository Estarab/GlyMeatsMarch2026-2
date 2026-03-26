import ProductRecipe from "../models/ProductRecipe.js";

export const getRecipes = async (req, res) => {
  const recipes = await ProductRecipe.find().populate("materials.material");
  res.json(recipes);
};

export const getRecipeById = async (req, res) => {
  const recipe = await ProductRecipe.findById(req.params.id).populate(
    "materials.material"
  );
  res.json(recipe);
};

export const createRecipe = async (req, res) => {
  const recipe = await ProductRecipe.create(req.body);
  res.status(201).json(recipe);
};

export const updateRecipe = async (req, res) => {
  const recipe = await ProductRecipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(recipe);
};

export const deleteRecipe = async (req, res) => {
  await ProductRecipe.findByIdAndDelete(req.params.id);
  res.json({ message: "Recipe deleted" });
};