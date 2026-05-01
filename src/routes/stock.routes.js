import express from "express";
import { StockLog } from "../models/StockLog.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET STOCK REPORTS
router.get("/", protectRoute, async (req, res) => {
  try {
    const { filter } = req.query;

    let dateFilter = {};

    const now = new Date();

    if (filter === "day") {
      dateFilter = { $gte: new Date(now.setDate(now.getDate() - 1)) };
    } else if (filter === "week") {
      dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
    } else if (filter === "month") {
      dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
    } else if (filter === "year") {
      dateFilter = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
    }

    const logs = await StockLog.find(
      filter === "all" ? {} : { createdAt: dateFilter }
    ).sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stock reports" });
  }
});

export default router;