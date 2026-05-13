import mongoose from "mongoose";

const SalesReportSchema = new mongoose.Schema(
  {
    date: String,
    time: String,
    items: [
      {
        name: String,
        qty: Number,
        price: Number,
      },
    ],
    subtotal: { type: Number, default: 0 }, 
    discount: { type: Number, default: 0 }, 
    total: { type: Number, required: true },
    total: Number,
    paymentMethod: String,
  },
  { timestamps: true }
);

export default mongoose.model("SalesReport", SalesReportSchema);