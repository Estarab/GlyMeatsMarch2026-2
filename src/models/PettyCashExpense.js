import mongoose from "mongoose";

const pettyCashExpenseSchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    approvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model(
  "PettyCashExpense",
  pettyCashExpenseSchema
);