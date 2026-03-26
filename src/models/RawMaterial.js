const mongoose = require("mongoose");

const RawMaterialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    unit: { type: String, required: true }, // kg, g, litres
    quantity: { type: Number, default: 0 },
    minimumLevel: { type: Number, default: 0 }, // low stock alerts
    supplier: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("RawMaterial", RawMaterialSchema);