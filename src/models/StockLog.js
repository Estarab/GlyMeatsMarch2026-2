import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    quantity: Number, // stock added
    type: {
      type: String,
      enum: ["IN", "OUT"],
      default: "IN",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const StockLog = mongoose.model("StockLog", stockLogSchema);