import mongoose from "mongoose";

const PettyCashExpenseSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PettyCashExpense = mongoose.model(
  "PettyCashExpense",
  PettyCashExpenseSchema
);

export default PettyCashExpense;