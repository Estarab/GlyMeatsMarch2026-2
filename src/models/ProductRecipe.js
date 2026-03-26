const mongoose = require("mongoose");

const RecipeMaterialSchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawMaterial",
  },
  quantityPerUnit: Number,
});

const ProductRecipeSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, unique: true },
    unit: { type: String, default: "kg" },
    materials: [RecipeMaterialSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductRecipe", ProductRecipeSchema);