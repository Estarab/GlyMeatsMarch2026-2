import express from "express";
import {
  saveStockReports,
  getStockReports,
} from "../controllers/stockReportController.js";
// import Product from "../models/Product.js";
import { Product } from "../models/Product.js";

const router = express.Router();

// 🔥 SAVE (SYNC FROM APP)
router.post("/bulk", saveStockReports);

// 🔥 GET ALL STOCK
router.get("/", getStockReports);

// 🔥 STOCK OUT (DEDUCT STOCK)
router.post("/stock-out/bulk", async (req, res) => {
  try {
    const updates = req.body;

    for (const item of updates) {
      await Product.findOneAndUpdate(
        { code: item.code }, // 🔑 must match your DB field
        { $inc: { stock: -item.qty } }
      );
    }

    res.json({ message: "Stock deducted successfully" });
  } catch (err) {
    console.error("Stock-out error:", err);
    res.status(500).json({ message: "Stock deduction failed" });
  }
});

export default router;