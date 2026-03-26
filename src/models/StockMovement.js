const mongoose = require("mongoose");

const StockMovementSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterial",
    },
    change: Number,
    type: {
      type: String,
      enum: ["PRODUCTION", "PURCHASE", "ADJUSTMENT"],
    },
    reference: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockMovement", StockMovementSchema);