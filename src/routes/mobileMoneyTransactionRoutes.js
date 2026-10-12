const express = require("express");
const router = express.Router();

const {
  createMobileMoneyTransaction,
  getMobileMoneyTransactions,
  getMobileMoneyTransactionById,
  reverseMobileMoneyTransaction,
} = require("../controllers/mobileMoneyTransactionController");

// GET /api/mobile-money-transactions
router.get("/", getMobileMoneyTransactions);

// POST /api/mobile-money-transactions
router.post("/", createMobileMoneyTransaction);

// GET /api/mobile-money-transactions/:id
router.get("/:id", getMobileMoneyTransactionById);

// POST /api/mobile-money-transactions/:id/reverse
router.post("/:id/reverse", reverseMobileMoneyTransaction);

module.exports = router;
