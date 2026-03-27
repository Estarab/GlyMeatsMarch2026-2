import mongoose from "mongoose";

const ProductionBatchSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    quantityProduced: {
      type: Number,
      required: true,
    },

    materialsUsed: [
      {
        material: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RawMaterial",
          required: true,
        },
        quantityUsed: {
          type: Number,
          required: true,
        },
      },
    ],

    producedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Named export (ESM)
export const ProductionBatch = mongoose.model(
  "ProductionBatch",
  ProductionBatchSchema
);