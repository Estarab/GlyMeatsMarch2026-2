import { Sale } from "../models/Sale.js";
import { Product } from "../models/Product.js";

// GET /api/sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("items.product", "name price")
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    console.error("Get sales error:", error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
};

// POST /api/sales (FIXED FOR OFFLINE SYNC)
export const createSale = async (req, res) => {
  try {
    const { items, subtotal, discount, total, paymentMethod, userId, transactionId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in sale" });
    }

    // ===================== NORMALIZE ITEMS =====================
    const normalizedItems = [];

    for (const item of items) {
      // ✅ SUPPORT BOTH OFFLINE + ONLINE
      const code = item.code;
      const productId = item.product || item.productId || item.id;

      let product = null;

      // 🔥 PRIORITY: find by code (BEST for your POS)
      if (code) {
        product = await Product.findOne({ code });
      }

      // fallback: find by id
      if (!product && productId) {
        product = await Product.findById(productId);
      }

      if (!product) {
        return res.status(404).json({
          message: `Product not found (code/id missing): ${code || productId}`,
        });
      }

      // ===================== STOCK VALIDATION =====================
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      normalizedItems.push({
        product: product._id,
        code: product.code, // ✅ IMPORTANT for debugging & sync
        quantity: item.quantity,
        price: item.price || product.price,
      });
    }

    // ===================== REDUCE STOCK (ATOMIC SAFE) =====================
    for (const item of normalizedItems) {
      await Product.updateOne(
        {
          _id: item.product,
          stock: { $gte: item.quantity }, // 🔥 prevents negative stock
        },
        {
          $inc: { stock: -item.quantity },
        }
      );
    }

    // ===================== CREATE SALE =====================
    const sale = await Sale.create({
      user: userId || req.user?._id,
      transactionId,
      items: normalizedItems,
      subtotal: subtotal || (total + (discount || 0)), 
      discount: discount || 0, 
      total,
      paymentMethod,
    });

    return res.status(201).json({
      success: true,
      sale,
    });
  } catch (error) {
    console.error("Create sale error:", error);
    return res.status(500).json({
      message: "Failed to create sale",
      error: error.message,
    });
  }
};




// import { Sale } from "../models/Sale.js";
// import { Product } from "../models/Product.js";

// // GET /api/sales
// export const getSales = async (req, res) => {
//   try {
//     const sales = await Sale.find()
//       .populate("items.product", "name price")
//       .populate("user", "-password")
//       .sort({ createdAt: -1 });

//     res.json(sales);
//   } catch (error) {
//     console.error("Get sales error:", error);
//     res.status(500).json({ message: "Failed to fetch sales" });
//   }
// };

// // POST /api/sales (FIXED FOR OFFLINE SYNC)
// export const createSale = async (req, res) => {
//   try {
//     const { items, total, paymentMethod, userId } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "No items in sale" });
//     }

//     // ===================== NORMALIZE OFFLINE ITEMS =====================
//     const normalizedItems = [];

//     for (const item of items) {
//       const productId = item.product || item.productId || item.id;

//       const product = await Product.findById(productId);

//       if (!product) {
//         return res.status(404).json({
//           message: `Product not found: ${productId}`,
//         });
//       }

//       if (product.stock < item.quantity) {
//         return res.status(400).json({
//           message: `Insufficient stock for ${product.name}`,
//         });
//       }

//       normalizedItems.push({
//         product: product._id,
//         quantity: item.quantity,
//         price: item.price || product.price,
//       });
//     }

//     // ===================== REDUCE STOCK =====================
//     for (const item of normalizedItems) {
//       await Product.findByIdAndUpdate(item.product, {
//         $inc: { stock: -item.quantity },
//       });
//     }

//     // ===================== CREATE SALE =====================
//     const sale = new Sale({
//       user: userId || req.user?._id, // safe fallback
//       items: normalizedItems,
//       total,
//       paymentMethod,
//     });

//     await sale.save();

//     return res.status(201).json({
//       success: true,
//       sale,
//     });
//   } catch (error) {
//     console.error("Create sale error:", error);
//     return res.status(500).json({
//       message: "Failed to create sale",
//       error: error.message,
//     });
//   }
// };



// import { Sale } from "../models/Sale.js";
// import { Product } from "../models/Product.js";

// // GET /api/sales
// export const getSales = async (req, res) => {
//   try {
//     const sales = await Sale.find()
//       .populate("items.product", "name price") // Only name & price
//       .populate("user", "-password"); // Exclude password

//     res.json(sales);
//   } catch (error) {
//     console.error("Get sales error:", error);
//     res.status(500).json({ message: "Failed to fetch sales" });
//   }
// };

// // POST /api/sales
// export const createSale = async (req, res) => {
//   try {
//     const { items, total, paymentMethod, userId } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "No items in sale" });
//     }

//     // Check stock before reducing
//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         return res.status(404).json({ message: `Product not found: ${item.product}` });
//       }
//       if (product.stock < item.quantity) {
//         return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
//       }
//     }

//     // Reduce stock
//     for (const item of items) {
//       await Product.findByIdAndUpdate(item.product, {
//         $inc: { stock: -item.quantity },
//       });
//     }

//     // Save sale
//     const sale = new Sale({
//       user: userId || req.user._id, // Use provided userId (for offline sync) or logged-in user
//       items,
//       total,
//       paymentMethod,
//     });

//     await sale.save();

//     res.status(201).json(sale);
//   } catch (error) {
//     console.error("Create sale error:", error);
//     res.status(400).json({ message: "Failed to create sale" });
//   }
// };



// import { Sale } from "../models/Sale.js";
// import { Product } from "../models/Product.js";

// // GET /api/sales
// // GET /api/sales
// export const getSales = async (req, res) => {
//   try {
//     const sales = await Sale.find()
//       // Populate product with only name and price
//       .populate("items.product", "name price")
//       // Populate user but exclude password
//       .populate("user", "-password");

//     res.json(sales);
//   } catch (error) {
//     console.error("Get sales error:", error);
//     res.status(500).json({ message: "Failed to fetch sales" });
//   }
// };
// // export const getSales = async (req, res) => {
// //   try {
// //     const sales = await Sale.find()
// //       .populate("items.product")
// //       .populate("user", "-password");

// //     res.json(sales);
// //   } catch (error) {
// //     console.error("Get sales error:", error);
// //     res.status(500).json({ message: "Failed to fetch sales" });
// //   }
// // };

// // POST /api/sales
// export const createSale = async (req, res) => {
//   try {
//     const { items, total, paymentMethod } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "No items in sale" });
//     }

//     // Reduce stock
//     for (const item of items) {
//       await Product.findByIdAndUpdate(item.product, {
//         $inc: { stock: -item.quantity },
//       });
//     }

//     const sale = new Sale({
//       user: req.user._id,
//       items,
//       total,
//       paymentMethod,
//     });

//     await sale.save();

//     res.status(201).json(sale);
//   } catch (error) {
//     console.error("Create sale error:", error);
//     res.status(400).json({ message: "Failed to create sale" });
//   }
// };



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