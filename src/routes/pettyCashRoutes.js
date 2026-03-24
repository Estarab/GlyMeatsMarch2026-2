import express from "express";
import {
  getExpenses,
  approveExpense,
  createExpense,
  getFloat,
  createFloat,
  getPettyCashSummary, 
} from "../controllers/pettyCashController.js";

const router = express.Router();

router.get("/expenses", getExpenses);
router.post("/expense", createExpense);  
router.put("/expenses/:id/approve", approveExpense);

router.get("/summary", getPettyCashSummary);

router.get("/float", getFloat);
router.post("/float", createFloat);

export default router;