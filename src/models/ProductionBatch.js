const mongoose = require("mongoose");

const ProductionBatchSchema = new mongoose.Schema(
  {
    productName: String,
    quantityProduced: Number,

    materialsUsed: [
      {
        material: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RawMaterial",
        },
        quantityUsed: Number,
      },
    ],

    producedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductionBatch", ProductionBatchSchema);