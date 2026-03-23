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

export default mongoose.model(
  "PettyCashFloat",
  pettyCashFloatSchema
);