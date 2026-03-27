import mongoose from "mongoose";

const RecipeMaterialSchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawMaterial",
    required: true,
  },
  quantityPerUnit: {
    type: Number,
    required: true,
  },
});

const ProductRecipeSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    unit: {
      type: String,
      default: "kg",
    },
    materials: [RecipeMaterialSchema],
  },
  { timestamps: true }
);

// Named export
export const ProductRecipe = mongoose.model(
  "ProductRecipe",
  ProductRecipeSchema
);