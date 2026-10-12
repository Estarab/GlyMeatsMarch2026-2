import express from "express";
import {
  createMobileMoneyTransaction,
  getMobileMoneyTransactions,
  getMobileMoneyTransactionById,
  reverseMobileMoneyTransaction,
} from "../controllers/mobileMoneyTransactionController.js";

const router = express.Router();

router.post("/", createMobileMoneyTransaction);
router.get("/", getMobileMoneyTransactions);
router.get("/:id", getMobileMoneyTransactionById);
router.patch("/:id/reverse", reverseMobileMoneyTransaction);

export default router;
