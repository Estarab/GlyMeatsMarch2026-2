import express from "express";
// import Product from "../models/Product.js";
import { Product } from "../models/Product.js";

const router = express.Router();

// 🔥 BULK STOCK OUT
router.post("/bulk", async (req, res) => {
  try {
    const items = req.body;

    console.log("📦 STOCK OUT RECEIVED:", items);

    for (const item of items) {
      if (!item.code) {
        console.log("❌ Missing code:", item);
        continue;
      }

      const updated = await Product.findOneAndUpdate(
        { code: item.code },
        { $inc: { quantity: -item.qty } },
        { new: true }
      );

      if (!updated) {
        console.log("❌ Product not found:", item.code);
      } else {
        console.log(
          `✅ Stock reduced: ${item.code} (-${item.qty})`
        );
      }
    }

    res.json({ message: "Stock updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Stock update failed" });
  }
});

export default router;