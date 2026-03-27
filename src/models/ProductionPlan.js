import mongoose from "mongoose";

const ProductionPlanSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    plannedQuantity: {
      type: Number,
      required: true,
    },
    plannedDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PLANNED", "COMPLETED", "CANCELLED"],
      default: "PLANNED",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Named export
export const ProductionPlan = mongoose.model(
  "ProductionPlan",
  ProductionPlanSchema
);