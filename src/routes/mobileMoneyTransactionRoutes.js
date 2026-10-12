
import express from "express";
import {
  createMobileMoneyTransaction,
  getMobileMoneyTransactions,
  getMobileMoneyTransactionById,
  reverseMobileMoneyTransaction,
} from "../controllers/mobileMoneyTransactionController.js";

const router = express.Router();

router.get("/", getMobileMoneyTransactions);
router.post("/", createMobileMoneyTransaction);
router.get("/:id", getMobileMoneyTransactionById);
router.post("/:id/reverse", reverseMobileMoneyTransaction);

export default router;
