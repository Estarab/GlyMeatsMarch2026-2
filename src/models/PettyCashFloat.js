import mongoose from "mongoose";

const PettyCashFloatSchema = new mongoose.Schema(
  {
    issuedAmount: { type: Number, default: 0 },
    remainingBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PettyCashFloat = mongoose.model(
  "PettyCashFloat",
  PettyCashFloatSchema
);

export default PettyCashFloat;