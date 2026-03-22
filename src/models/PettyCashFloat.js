const mongoose = require("mongoose");

const PettyCashFloatSchema = new mongoose.Schema({
  issuedAmount: { type: Number, required: true },
  remainingBalance: { type: Number, required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  issuedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PettyCashFloat", PettyCashFloatSchema);