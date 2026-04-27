import express from "express";
import {
  saveStockReports,
  getStockReports,
} from "../controllers/stockReportController.js";

const router = express.Router();

// 🔥 SAVE (SYNC FROM APP)
router.post("/bulk", saveStockReports);

// 🔥 GET ALL STOCK
router.get("/", getStockReports);

export default router;