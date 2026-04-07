import { Sale } from "../models/Sale.js";
import { Product } from "../models/Product.js";

// GET /api/sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("items.product")
      .populate("user", "-password");

    res.json(sales);
  } catch (error) {
    console.error("Get sales error:", error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};

// POST /api/sales
export const createSale = async (req, res) => {
  try {
    const { items, total, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in sale" });
    }

    // Reduce stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const sale = new Sale({
      user: req.user._id,
      items,
      total,
      paymentMethod,
    });

    await sale.save();

    res.status(201).json(sale);
  } catch (error) {
    console.error("Create sale error:", error);
    res.status(400).json({ message: "Failed to create sale" });
  }
};



// import Sale from "../models/Sale.js";
// import Product from "../models/Product.js";

// // GET /api/sales
// export const getSales = async (req, res) => {
//   try {
//     const sales = await Sale.find().populate("items.product").populate("user", "-password");
//     res.json(sales);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch sales" });
//   }
// };

// // POST /api/sales
// export const createSale = async (req, res) => {
//   try {
//     const { items, total, paymentMethod } = req.body;

//     // reduce stock
//     for (const item of items) {
//       await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
//     }

//     const sale = new Sale({ user: req.user._id, items, total, paymentMethod });
//     await sale.save();

//     res.status(201).json(sale);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Failed to create sale" });
//   }
// };