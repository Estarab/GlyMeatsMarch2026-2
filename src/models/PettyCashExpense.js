const mongoose = require("mongoose");

const PettyCashExpenseSchema = new mongoose.Schema({
  amount: Number,
  reason: String,
  status: { type: String, default: "pending" },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  floatId: { type: mongoose.Schema.Types.ObjectId, ref: "PettyCashFloat" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PettyCashExpense", PettyCashExpenseSchema);