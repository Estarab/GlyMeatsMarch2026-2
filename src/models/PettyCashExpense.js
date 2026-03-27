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
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Named export instead of default
export const PettyCashExpense = mongoose.model(
  "PettyCashExpense",
  pettyCashExpenseSchema
);