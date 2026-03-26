const mongoose = require("mongoose");

const ProductionPlanSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    plannedQuantity: Number,
    plannedDate: Date,
    status: {
      type: String,
      enum: ["PLANNED", "COMPLETED", "CANCELLED"],
      default: "PLANNED",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductionPlan", ProductionPlanSchema);