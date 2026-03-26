import ProductionBatch from "../models/ProductionBatch.js";
import RawMaterial from "../models/RawMaterial.js";

export const getProductionReport = async (req, res) => {
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
    (sum, b) => sum + b.costOfProduction,
    0
  );

  res.json({ batches, totalProduced, totalCost });
};

export const getReorderReport = async (req, res) => {
  const materials = await RawMaterial.find();

  const suggestions = materials.filter(
    (m) => m.quantity <= m.minimumLevel
  );

  res.json(suggestions);
};

export const getMaterialUsageReport = async (req, res) => {
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
};

export const getProfitReport = async (req, res) => {
  const batches = await ProductionBatch.find();

  const totalProfit = batches.reduce(
    (sum, b) => sum + (b.estimatedProfit || 0),
    0
  );

  res.json({ totalProfit });
};