import mongoose from "mongoose";

const pettyCashFloatSchema = new mongoose.Schema(
  {
    issuedAmount: {
      type: Number,
      default: 0,
    },
    remainingBalance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Named export
export const PettyCashFloat = mongoose.model(
  "PettyCashFloat",
  pettyCashFloatSchema
);