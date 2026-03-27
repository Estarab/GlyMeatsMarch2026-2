import mongoose from "mongoose";

const MaterialPurchaseSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterial",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    supplier: {
      type: String,
      default: "Unknown",
    },
  },
  { timestamps: true }
);

// Named ES module export
export const MaterialPurchase = mongoose.model(
  "MaterialPurchase",
  MaterialPurchaseSchema
);