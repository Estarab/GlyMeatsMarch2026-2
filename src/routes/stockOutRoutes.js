import express from "express";
import { Product } from "../models/Product.js";

const router = express.Router();

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
        { $inc: { stock: -item.qty } }, // 🔥 FIXED HERE
        { new: true }
      );

      if (!updated) {
        console.log("❌ Product not found:", item.code);
      } else {
        console.log(
          `✅ Stock reduced: ${item.code} (-${item.qty}) | New stock: ${updated.stock}`
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