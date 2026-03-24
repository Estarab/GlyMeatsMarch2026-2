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

/* =========================================
   CREATE PETTY CASH EXPENSE
========================================= */
export const createExpense = async (req, res) => {
  try {
    const { amount, reason, floatId } = req.body;

    if (!amount || amount <= 0 || !reason || !floatId) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const float = await PettyCashFloat.findById(floatId);
    if (!float) {
      return res.status(404).json({ message: "Float not found" });
    }

    if (amount > float.remainingBalance) {
      return res.status(400).json({ message: "Insufficient float balance" });
    }

    const expense = await PettyCashExpense.create({
      amount,
      reason,
      floatId,
      status: "pending",
    });

    // Deduct from float immediately
    float.remainingBalance -= amount;
    await float.save();

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPettyCashSummary = async (req, res) => {
  try {
    // period is passed as: /summary?period=week|month|year
    const { period } = req.query;

    const now = new Date();
    let startDate;

    // determine start date based on filter
    // =============================

if (period === "day") {
  // start of today
  startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
} else if (period === "week") {
  startDate = new Date();
  startDate.setDate(now.getDate() - 7);
} else if (period === "month") {
  startDate = new Date(now.getFullYear(), now.getMonth(), 1);
} else if (period === "year") {
  startDate = new Date(now.getFullYear(), 0, 1);
} else {
  return res.status(400).json({ message: "Invalid period" });
}

    // =====================================
    // CALCULATE TOTAL FLOAT ISSUED
    // =====================================
    const floats = await PettyCashFloat.find({
      createdAt: { $gte: startDate },
    });

    const issued = floats.reduce((sum, f) => sum + f.issuedAmount, 0);

    // =====================================
    // CALCULATE TOTAL APPROVED EXPENSES
    // =====================================
    const expenses = await PettyCashExpense.find({
      status: "approved",
      createdAt: { $gte: startDate },
    });

    const spent = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      period,
      issued,
      spent,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// import PettyCashExpense from "../models/PettyCashExpense.js";
// import PettyCashFloat from "../models/PettyCashFloat.js";

// /* =========================================
//    GET ALL PENDING EXPENSES
// ========================================= */
// export const getExpenses = async (req, res) => {
//   try {
//     const expenses = await PettyCashExpense.find({
//       status: "pending",
//     }).sort({ createdAt: -1 });

//     res.json(expenses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================================
//    APPROVE EXPENSE
// ========================================= */
// export const approveExpense = async (req, res) => {
//   try {
//     const expense = await PettyCashExpense.findById(req.params.id);
//     if (!expense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }

//     if (expense.status === "approved") {
//       return res.status(400).json({ message: "Already approved" });
//     }

//     const float = await PettyCashFloat.findOne();
//     if (!float || float.remainingBalance < expense.amount) {
//       return res
//         .status(400)
//         .json({ message: "Insufficient petty cash float" });
//     }

//     float.remainingBalance -= expense.amount;
//     await float.save();

//     expense.status = "approved";
//     expense.approvedAt = new Date();
//     await expense.save();

//     res.json({ message: "Expense approved", expense });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================================
//    GET FLOAT
// ========================================= */
// export const getFloat = async (req, res) => {
//   try {
//     let float = await PettyCashFloat.findOne();

//     if (!float) {
//       float = await PettyCashFloat.create({
//         issuedAmount: 0,
//         remainingBalance: 0,
//       });
//     }

//     res.json(float);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================================
//    ISSUE / REPLENISH FLOAT
// ========================================= */
// export const createFloat = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ message: "Invalid amount" });
//     }

//     let float = await PettyCashFloat.findOne();

//     if (!float) {
//       float = await PettyCashFloat.create({
//         issuedAmount: amount,
//         remainingBalance: amount,
//       });
//     } else {
//       float.issuedAmount += amount;
//       float.remainingBalance += amount;
//       await float.save();
//     }

//     res.json(float);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================================
//    CREATE PETTY CASH EXPENSE
// ========================================= */
// export const createExpense = async (req, res) => {
//   try {
//     const { amount, reason, floatId } = req.body;

//     if (!amount || amount <= 0 || !reason || !floatId) {
//       return res.status(400).json({ message: "Missing or invalid fields" });
//     }

//     const float = await PettyCashFloat.findById(floatId);
//     if (!float) {
//       return res.status(404).json({ message: "Float not found" });
//     }

//     if (amount > float.remainingBalance) {
//       return res.status(400).json({ message: "Insufficient float balance" });
//     }

//     const expense = await PettyCashExpense.create({
//       amount,
//       reason,
//       floatId,
//       status: "pending",
//     });

//     // Deduct from float immediately
//     float.remainingBalance -= amount;
//     await float.save();

//     res.status(201).json(expense);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };