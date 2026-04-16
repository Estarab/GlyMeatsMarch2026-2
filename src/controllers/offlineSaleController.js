import { OfflineSale } from "../models/OfflineSale.js";
import { Product } from "../models/Product.js";

// ===================== SYNC OFFLINE SALE =====================
export const syncOfflineSale = async (req, res) => {
  try {
    const { items, total, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "No items found" });
    }

    const normalizedItems = [];

    // ===================== VALIDATE + ENRICH ITEMS =====================
    for (const item of items) {
      const productId = item.product || item.productId || item.id;

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${productId}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const lineTotal = item.price * item.quantity;

      normalizedItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: item.price || product.price,
        lineTotal,
      });
    }

    // ===================== REDUCE STOCK =====================
    for (const item of normalizedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // ===================== SAVE OFFLINE SALE =====================
    const sale = await OfflineSale.create({
      items: normalizedItems,
      total,
      paymentMethod,
    });

    return res.status(201).json({
      success: true,
      message: "Offline sale synced successfully",
      sale,
    });
  } catch (error) {
    console.error("Offline sync error:", error);
    res.status(500).json({
      message: "Sync failed",
      error: error.message,
    });
  }
};

// ===================== GET ALL OFFLINE SALES =====================
export const getOfflineSales = async (req, res) => {
  try {
    const sales = await OfflineSale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch offline sales",
    });
  }
};