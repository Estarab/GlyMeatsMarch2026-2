import RawMaterial from "../models/RawMaterial.js";
import MaterialPurchase from "../models/MaterialPurchase.js";
import StockMovement from "../models/StockMovement.js";

export const getRawMaterials = async (req, res) => {
  try {
    const materials = await RawMaterial.find().sort({ name: 1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const material = await RawMaterial.findById(req.params.id);
    if (!material)
      return res.status(404).json({ message: "Material not found" });

    res.json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createMaterial = async (req, res) => {
  try {
    const material = await RawMaterial.create(req.body);
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const material = await RawMaterial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    await RawMaterial.findByIdAndDelete(req.params.id);
    res.json({ message: "Material deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const restockMaterial = async (req, res) => {
  try {
    const { quantity, cost, supplier } = req.body;

    const material = await RawMaterial.findById(req.params.id);
    if (!material)
      return res.status(404).json({ message: "Material not found" });

    material.quantity += quantity;
    material.averageCost = cost;
    await material.save();

    await MaterialPurchase.create({
      material: material._id,
      quantity,
      cost,
      supplier,
    });

    await StockMovement.create({
      material: material._id,
      change: quantity,
      type: "PURCHASE",
      reference: supplier,
    });

    res.json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};