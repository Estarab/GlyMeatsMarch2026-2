import express from "express";
import Return from "../models/Return.js";
import { Product } from "../models/Product.js";

const router = express.Router();

// ========================================================
// 1. GET ALL RETURNS + ADVANCED FILTERING (THE MISSING LINK)
// ========================================================
router.get("/", async (req, res) => {
  try {
    const { filter, category, startDate, endDate } = req.query;
    
    // Initialize query build object
    let dbQuery = {};

    // Filter by Category if provided
    if (category) {
      // Uses a case-insensitive regex match so "Meat" and "meat" both work
      dbQuery.category = { $regex: category, $options: "i" };
    }

    // Filter by Custom Date Range OR Preset Filter Values
    if (startDate || endDate) {
      dbQuery.createdAt = {};
      if (startDate) dbQuery.createdAt.$gte = new Date(startDate);
      if (endDate) {
        // Sets end date to the very end of that day (23:59:59)
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dbQuery.createdAt.$lte = end;
      }
    } else if (filter && filter !== "all") {
      const now = new Date();
      let dateLimit = new Date();

      if (filter === "day") {
        dateLimit.setHours(0, 0, 0, 0); // Start of today
      } else if (filter === "week") {
        dateLimit.setDate(now.getDate() - 7); // Last 7 days
      } else if (filter === "month") {
        dateLimit.setMonth(now.getMonth() - 1); // Last 30 days
      } else if (filter === "year") {
        dateLimit.setFullYear(now.getFullYear() - 1); // Last 365 days
      }

      dbQuery.createdAt = { $gte: dateLimit };
    }

    // Fetch matching data from MongoDB sorted by newest first
    const returnsData = await Return.find(dbQuery).sort({ createdAt: -1 });
    
    // Send back raw array directly matching your mobile app mapping expectation
    res.status(200).json(returnsData);
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json({
      message: "Failed to fetch returns data",
      error: error.message,
    });
  }
});


// ========================================================
// 2. CREATE RETURN + ADJUST STOCK
// ========================================================
router.post("/", async (req, res) => {
  try {
    const {
      productName,
      category,
      code,
      reason,
      price,
      quantity,
    } = req.body;

    // VALIDATION
    if (
      !productName ||
      !category ||
      !code ||
      !reason ||
      !price ||
      !quantity
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // FIND PRODUCT USING CODE
    const product = await Product.findOne({ code });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // NOTE ON LOGIC: Usually, when items are "Returned" by a customer, 
    // inventory stock goes UP (+), not down (-). 
    // Change this to a plus sign if you want returns to add items back to your shelf!
    product.stock = parseFloat(product.stock) - parseFloat(quantity);

    await product.save();

    // SAVE RETURN
    const newReturn = await Return.create({
      productName,
      category,
      code,
      reason,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
    });

    res.status(201).json({
      message: "Return saved successfully",
      return: newReturn,
      updatedStock: product.stock,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save return",
      error: error.message,
    });
  }
});

export default router;