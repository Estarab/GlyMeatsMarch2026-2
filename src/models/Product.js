import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    barcode: { type: String, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);