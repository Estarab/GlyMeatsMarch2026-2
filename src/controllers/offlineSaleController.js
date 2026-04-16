import { Sale } from "../models/Sale.js";
import { Product } from "../models/Product.js";

export const syncOfflineSales = async (req, res) => {
  try {
    const { sales } = req.body;

    if (!Array.isArray(sales)) {
      return res.status(400).json({ message: "Sales must be an array" });
    }

    let saved = [];
    let skipped = [];

    for (const sale of sales) {
      try {
        // 🔥 1. Prevent duplicates (CRITICAL)
        const exists = await Sale.findOne({
          clientId: sale.clientId,
        });

        if (exists) {
          skipped.push({ clientId: sale.clientId, reason: "duplicate" });
          continue;
        }

        // 🔥 2. STOCK VALIDATION
        for (const item of sale.items) {
          const product = await Product.findById(item.product);

          if (!product) {
            throw new Error(`Product not found ${item.product}`);
          }

          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
        }

        // 🔥 3. REDUCE STOCK (ATOMIC SAFE)
        for (const item of sale.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }

        // 🔥 4. SAVE SALE
        const newSale = await Sale.create({
          clientId: sale.clientId,
          user: req.user._id,
          items: sale.items.map((i) => ({
            product: i.product,
            quantity: i.quantity,
            price: i.price,
          })),
          total: sale.total,
          paymentMethod: sale.paymentMethod,
          synced: true,
        });

        saved.push(newSale);
      } catch (err) {
        skipped.push({
          clientId: sale.clientId,
          reason: err.message,
        });
      }
    }

    return res.json({
      message: "Bulk sync completed",
      saved: saved.length,
      skipped,
      data: saved,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Sync failed", error: err.message });
  }
};