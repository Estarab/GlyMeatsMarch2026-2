import PettyCashExpense from "../models/PettyCashExpense.js";
import PettyCashFloat from "../models/PettyCashFloat.js";

/* =========================================
   GET ALL PENDING EXPENSES
========================================= */
export const getExpenses = async (req, res) => {
  try {
    const expenses = await PettyCashExpense.find({
      status: "pending",
    }).sort({ createdAt: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================
   APPROVE EXPENSE
========================================= */
export const approveExpense = async (req, res) => {
  try {
    const expense = await PettyCashExpense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.status === "approved") {
      return res.status(400).json({ message: "Already approved" });
    }

    const float = await PettyCashFloat.findOne();
    if (!float || float.remainingBalance < expense.amount) {
      return res
        .status(400)
        .json({ message: "Insufficient petty cash float" });
    }

    float.remainingBalance -= expense.amount;
    await float.save();

    expense.status = "approved";
    expense.approvedAt = new Date();
    await expense.save();

    res.json({ message: "Expense approved", expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================
   GET FLOAT
========================================= */
export const getFloat = async (req, res) => {
  try {
    let float = await PettyCashFloat.findOne();

    if (!float) {
      float = await PettyCashFloat.create({
        issuedAmount: 0,
        remainingBalance: 0,
      });
    }

    res.json(float);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================
   ISSUE / REPLENISH FLOAT
========================================= */
export const createFloat = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    let float = await PettyCashFloat.findOne();

    if (!float) {
      float = await PettyCashFloat.create({
        issuedAmount: amount,
        remainingBalance: amount,
      });
    } else {
      float.issuedAmount += amount;
      float.remainingBalance += amount;
      await float.save();
    }

    res.json(float);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};