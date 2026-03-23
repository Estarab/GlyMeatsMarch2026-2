// src/routes/pettyCash.js
import express from "express";
import PettyCashFloat from "../models/PettyCashFloat.js";
import PettyCashExpense from "../models/PettyCashExpense.js";

const router = express.Router();

// =============================
// GET current float
// =============================
router.get("/float", async (req, res) => {
  try {
    const float = await PettyCashFloat.findOne();
    res.status(200).json(float);
  } catch (error) {
    console.error("Error fetching float:", error);
    res.status(500).json({ message: "Failed to fetch float" });
  }
});

// =============================
// Issue or replenish float
// =============================
router.post("/float", async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    let float = await PettyCashFloat.findOne();

    if (!float) {
      float = new PettyCashFloat({
        issuedAmount: amount,
        remainingBalance: amount,
      });
    } else {
      float.issuedAmount += amount;
      float.remainingBalance += amount;
    }

    await float.save();
    res.status(200).json(float);
  } catch (error) {
    console.error("Error issuing float:", error);
    res.status(500).json({ message: "Failed to issue float" });
  }
});

// =============================
// Create expense
// =============================
router.post("/expense", async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount);
    const { reason } = req.body;

    if (!reason || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid expense data" });
    }

    const expense = new PettyCashExpense({
      amount,
      reason,
      approved: false,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Failed to create expense" });
  }
});

// =============================
// Get pending expenses
// =============================
router.get("/expenses", async (req, res) => {
  try {
    const expenses = await PettyCashExpense.find({ approved: false });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// =============================
// Approve expense
// =============================
router.put("/expense/:id/approve", async (req, res) => {
  try {
    const expense = await PettyCashExpense.findById(req.params.id);
    const float = await PettyCashFloat.findOne();

    if (!expense || !float) {
      return res.status(404).json({ message: "Expense or float not found" });
    }

    if (float.remainingBalance < expense.amount) {
      return res.status(400).json({ message: "Insufficient float balance" });
    }

    expense.approved = true;
    float.remainingBalance -= expense.amount;

    await expense.save();
    await float.save();

    res.json({ message: "Expense approved" });
  } catch (error) {
    console.error("Error approving expense:", error);
    res.status(500).json({ message: "Failed to approve expense" });
  }
});

// =============================
// Default export
// =============================
export default router;