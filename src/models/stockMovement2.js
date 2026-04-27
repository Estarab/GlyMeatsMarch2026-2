import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    productId: String,
    productName: String,
    quantityAdded: Number,
    type: { type: String, default: "IN" },
  },
  { timestamps: true } // ✅ Mongo will auto-create createdAt
);

// ✅ MATCH YOUR CONTROLLER IMPORT
export default mongoose.model("StockMovement2", stockSchema);