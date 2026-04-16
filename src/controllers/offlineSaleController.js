import { OfflineSale } from "../models/OfflineSale.js";
import { Product } from "../models/Product.js";

// ===================== SYNC OFFLINE SALES =====================
export const syncOfflineSales = async (req, res) => {
  try {
    const { sales } = req.body;

    if (!Array.isArray(sales) || sales.length === 0) {
      return res.status(400).json({ message: "No sales to sync" });
    }

    const savedSales = [];

    for (const sale of sales) {
      const { items, total, paymentMethod } = sale;

      if (!items?.length) continue;

      // validate stock
      for (const item of items) {
        const product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            message: `Product not found: ${item.productId}`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}`,
          });
        }
      }

      // reduce stock
      for (const item of items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      // save offline sale
      const newSale = await OfflineSale.create({
        total,
        paymentMethod,
        items,
      });

      savedSales.push(newSale);
    }

    res.status(201).json({
      message: "Offline sales synced successfully",
      count: savedSales.length,
      data: savedSales,
    });
  } catch (err) {
    console.error("SYNC ERROR:", err);
    res.status(500).json({ message: "Sync failed" });
  }
};

// ===================== GET OFFLINE SALES =====================
export const getOfflineSales = async (req, res) => {
  const sales = await OfflineSale.find().sort({ createdAt: -1 });
  res.json(sales);
};