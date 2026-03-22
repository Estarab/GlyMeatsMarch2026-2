const express = require("express");
const router = express.Router();
const Float = require("../models/PettyCashFloat");
const Expense = require("../models/PettyCashExpense");

router.post("/float", async (req, res) => {
  const { amount } = req.body;
  const float = await Float.create({
    issuedAmount: amount,
    remainingBalance: amount
  });
  res.json(float);
});

router.post("/expense", async (req, res) => {
  const { amount, reason, floatId } = req.body;
  const expense = await Expense.create({ amount, reason, floatId });
  res.json(expense);
});

router.put("/expense/:id/approve", async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  const float = await Float.findById(expense.floatId);

  float.remainingBalance -= expense.amount;
  expense.status = "approved";
  await float.save();
  await expense.save();

  res.json({ expense, float });
});

router.get("/float", async (req, res) => {
  const float = await Float.findOne().sort({ issuedAt: -1 });
  res.json(float);
});

module.exports = router;