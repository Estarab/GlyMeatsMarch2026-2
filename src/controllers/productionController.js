import { ProductionBatch } from "../models/ProductionBatch.js";
import { RawMaterial } from "../models/RawMaterial.js";
import { ProductRecipe } from "../models/ProductRecipe.js";
import { StockMovement } from "../models/StockMovement.js";
import { Product } from "../models/Product.js";

export const createProductionBatch = async (req, res) => {
  try {
    const { productName, quantityProduced } = req.body;

    if (!productName || !quantityProduced) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const recipe = await ProductRecipe.findOne({ productName }).populate(
      "materials.material"
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const materialsUsed = [];
    let totalCost = 0;

    for (const item of recipe.materials) {
      const requiredQty = item.quantityPerUnit * quantityProduced;

      const material = await RawMaterial.findById(item.material._id);
      if (!material || material.quantity < requiredQty) {
        return res.status(400).json({
          message: `Insufficient ${material?.name || "material"} stock`,
        });
      }

      material.quantity -= requiredQty;
      await material.save();

      totalCost += requiredQty * (material.averageCost || 0);

      await StockMovement.create({
        material: material._id,
        change: -requiredQty,
        type: "PRODUCTION",
        reference: productName,
      });

      materialsUsed.push({
        material: material._id,
        quantityUsed: requiredQty,
      });
    }

    const product = await Product.findOne({ name: productName });

    const costPerUnit = totalCost / quantityProduced;
    const estimatedProfit =
      (product?.price || 0) * quantityProduced - totalCost;

    const batch = await ProductionBatch.create({
      productName,
      quantityProduced,
      materialsUsed,
      costOfProduction: totalCost,
      costPerUnit,
      estimatedProfit,
      producedBy: req.user.id,
    });

    res.status(201).json(batch);
  } catch (err) {
    console.error("Production error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getProductionHistory = async (req, res) => {
  try {
    const batches = await ProductionBatch.find()
      .populate("materialsUsed.material")
      .sort({ createdAt: -1 });

    res.json(batches);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getProductionBatchById = async (req, res) => {
  try {
    const batch = await ProductionBatch.findById(req.params.id).populate(
      "materialsUsed.material"
    );

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json(batch);
  } catch (err) {
    console.error("Get batch error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteProductionBatch = async (req, res) => {
  try {
    const batch = await ProductionBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    await batch.deleteOne();
    res.json({ message: "Production batch deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
};



// import ProductionBatch from "../models/ProductionBatch.js";
// import RawMaterial from "../models/RawMaterial.js";
// import ProductRecipe from "../models/ProductRecipe.js";
// import StockMovement from "../models/StockMovement.js";
// import Product from "../models/Product.js";

// export const createProductionBatch = async (req, res) => {
//   try {
//     const { productName, quantityProduced } = req.body;

//     if (!productName || !quantityProduced) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     const recipe = await ProductRecipe.findOne({ productName }).populate(
//       "materials.material"
//     );

//     if (!recipe) {
//       return res.status(404).json({ message: "Recipe not found" });
//     }

//     const materialsUsed = [];
//     let totalCost = 0;

//     for (const item of recipe.materials) {
//       const requiredQty = item.quantityPerUnit * quantityProduced;

//       const material = await RawMaterial.findById(item.material._id);
//       if (!material || material.quantity < requiredQty) {
//         return res.status(400).json({
//           message: `Insufficient ${material?.name || "material"} stock`,
//         });
//       }

//       material.quantity -= requiredQty;
//       await material.save();

//       totalCost += requiredQty * material.averageCost;

//       await StockMovement.create({
//         material: material._id,
//         change: -requiredQty,
//         type: "PRODUCTION",
//         reference: productName,
//       });

//       materialsUsed.push({
//         material: material._id,
//         quantityUsed: requiredQty,
//       });
//     }

//     const product = await Product.findOne({ name: productName });

//     const costPerUnit = totalCost / quantityProduced;
//     const estimatedProfit =
//       (product?.price || 0) * quantityProduced - totalCost;

//     const batch = await ProductionBatch.create({
//       productName,
//       quantityProduced,
//       materialsUsed,
//       costOfProduction: totalCost,
//       costPerUnit,
//       estimatedProfit,
//       producedBy: req.user.id,
//     });

//     res.status(201).json(batch);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getProductionHistory = async (req, res) => {
//   try {
//     const batches = await ProductionBatch.find()
//       .populate("materialsUsed.material")
//       .sort({ createdAt: -1 });

//     res.json(batches);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getProductionBatchById = async (req, res) => {
//   try {
//     const batch = await ProductionBatch.findById(req.params.id).populate(
//       "materialsUsed.material"
//     );

//     if (!batch) {
//       return res.status(404).json({ message: "Batch not found" });
//     }

//     res.json(batch);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const deleteProductionBatch = async (req, res) => {
//   try {
//     const batch = await ProductionBatch.findById(req.params.id);

//     if (!batch) {
//       return res.status(404).json({ message: "Batch not found" });
//     }

//     await batch.deleteOne();
//     res.json({ message: "Production batch deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };