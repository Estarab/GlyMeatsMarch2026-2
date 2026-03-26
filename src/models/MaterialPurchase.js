const mongoose = require("mongoose");

const MaterialPurchaseSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RawMaterial",
    },
    quantity: Number,
    cost: Number,
    supplier: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaterialPurchase", MaterialPurchaseSchema);