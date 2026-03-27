import mongoose from "mongoose";

const RawMaterialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    unit: {
      type: String,
      required: true, // kg, g, litres
    },
    quantity: {
      type: Number,
      default: 0,
    },
    minimumLevel: {
      type: Number,
      default: 0, // low stock alerts
    },
    supplier: {
      type: String,
    },
  },
  { timestamps: true }
);

// Named export
export const RawMaterial = mongoose.model(
  "RawMaterial",
  RawMaterialSchema
);