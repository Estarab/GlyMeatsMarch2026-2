import express from "express";
import PettyCash from "../models/PettyCash.js";

const router = express.Router();

/**
 * GET current float
 */
router.get("/float", async (req, res) => {
  try {
    const float = await PettyCash.findOne({ type: "float" });
    res.status(200).json(float);
  } catch (error) {
    console.log("Error fetching float:", error);
    res.status(500).json({ message: "Failed to fetch float" });
  }
});

/**
 * Issue or replenish float
 */
router.post("/float", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    let float = await PettyCash.findOne({ type: "float" });

    if (!float) {
      float = new PettyCash({
        type: "float",
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
    console.log("Error issuing float:", error);
    res.status(500).json({ message: "Failed to issue float" });
  }
});

/**
 * Create petty cash expense (cashier)
 */
router.post("/expense", async (req, res) => {
  try {
    const { amount, reason } = req.body;

    if (!amount || !reason) {
      return res.status(400).json({ message: "Amount and reason required" });
    }

    const expense = new PettyCash({
      type: "expense",
      amount,
      reason,
      approved: false,
    });

    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    console.log("Error creating expense:", error);
    res.status(500).json({ message: "Failed to create expense" });
  }
});

/**
 * Get pending expenses (director view)
 */
router.get("/expenses", async (req, res) => {
  try {
    const expenses = await PettyCash.find({
      type: "expense",
      approved: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.log("Error fetching expenses:", error);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

/**
 * Approve expense (director)
 */
router.put("/expense/:id/approve", async (req, res) => {
  try {
    const expense = await PettyCash.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const float = await PettyCash.findOne({ type: "float" });
    if (!float) {
      return res.status(400).json({ message: "No petty cash float available" });
    }

    if (float.remainingBalance < expense.amount) {
      return res.status(400).json({ message: "Insufficient float balance" });
    }

    // approve and deduct
    expense.approved = true;
    float.remainingBalance -= expense.amount;

    await expense.save();
    await float.save();

    res.status(200).json({ message: "Expense approved", expense });
  } catch (error) {
    console.log("Error approving expense:", error);
    res.status(500).json({ message: "Failed to approve expense" });
  }
});

export default router;