import { ProductionBatch } from "../models/ProductionBatch.js";
import { RawMaterial } from "../models/RawMaterial.js";

export const getProductionReport = async (req, res) => {
  try {
    const { start, end } = req.query;

    const batches = await ProductionBatch.find({
      createdAt: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    });

    const totalProduced = batches.reduce(
      (sum, b) => sum + b.quantityProduced,
      0
    );

    const totalCost = batches.reduce(
      (sum, b) => sum + (b.costOfProduction || 0),
      0
    );

    res.json({ batches, totalProduced, totalCost });
  } catch (err) {
    console.error("Production report error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getReorderReport = async (req, res) => {
  try {
    const materials = await RawMaterial.find();

    const suggestions = materials.filter(
      (m) => m.quantity <= m.minimumLevel
    );

    res.json(suggestions);
  } catch (err) {
    console.error("Reorder report error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getMaterialUsageReport = async (req, res) => {
  try {
    const usage = await ProductionBatch.aggregate([
      { $unwind: "$materialsUsed" },
      {
        $group: {
          _id: "$materialsUsed.material",
          totalUsed: { $sum: "$materialsUsed.quantityUsed" },
        },
      },
    ]);

    res.json(usage);
  } catch (err) {
    console.error("Material usage error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getProfitReport = async (req, res) => {
  try {
    const batches = await ProductionBatch.find();

    const totalProfit = batches.reduce(
      (sum, b) => sum + (b.estimatedProfit || 0),
      0
    );

    res.json({ totalProfit });
  } catch (err) {
    console.error("Profit report error:", err);
    res.status(500).json({ message: err.message });
  }
};