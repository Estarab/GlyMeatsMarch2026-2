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
    total: Number,
    paymentMethod: String,
  },
  { timestamps: true }
);

export default mongoose.model("SalesReport", SalesReportSchema);