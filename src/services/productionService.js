import RawMaterial from "../models/RawMaterial.js";
import ProductRecipe from "../models/ProductRecipe.js";
import ProductionBatch from "../models/ProductionBatch.js";
import StockMovement from "../models/StockMovement.js";

import {
  calculateRequiredMaterials,
  checkStockAvailability,
} from "../utils/stockCalculator.js";

/**
 * Process a production batch:
 * - validates recipe
 * - calculates required materials
 * - checks inventory
 * - deducts stock
 * - records stock movements
 * - creates production batch record
 */
export const processProduction = async (productName, quantity, userId) => {
  // ===============================
  // LOAD RECIPE
  // ===============================
  const recipe = await ProductRecipe.findOne({ productName }).populate(
    "materials.material"
  );

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  // ===============================
  // LOAD CURRENT INVENTORY
  // ===============================
  const inventory = await RawMaterial.find();

  // ===============================
  // CALCULATE REQUIRED MATERIALS
  // ===============================
  const required = calculateRequiredMaterials(recipe, quantity);

  // ===============================
  // CHECK FOR SHORTAGES
  // ===============================
  const shortages = checkStockAvailability(required, inventory);

  if (shortages.length > 0) {
    return { shortages };
  }

  // ===============================
  // DEDUCT STOCK
  // ===============================
  for (const req of required) {
    const material = await RawMaterial.findById(req.material);

    if (!material) {
      throw new Error("Material not found during deduction");
    }

    material.quantity -= req.required;
    await material.save();

    // log stock movement
    await StockMovement.create({
      material: material._id,
      change: -req.required,
      type: "PRODUCTION",
      reference: productName,
    });
  }

  // ===============================
  // CREATE PRODUCTION BATCH
  // ===============================
  const batch = await ProductionBatch.create({
    productName,
    quantityProduced: quantity,
    materialsUsed: required.map((r) => ({
      material: r.material,
      quantityUsed: r.required,
    })),
    producedBy: userId,
  });

  return { batch };
};