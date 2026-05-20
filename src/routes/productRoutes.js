import express from "express";
import { Product } from "../models/Product.js";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// =====================
// CREATE PRODUCT (With Duplicate Check)
// =====================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      buyingPrice,
      description,
      image,
      stock,
      code,
    } = req.body;

    if (!name || !category || !price || !buyingPrice || !stock || !code) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 🔍 1. Check if the product code already exists
    const existingProduct = await Product.findOne({ code });
    if (existingProduct) {
      return res.status(409).json({
        message: "Product code already exists",
        existingProduct: existingProduct, // ◄ Sends back details so React Native can prompt the user
      });
    }

    // 2. If it's a unique code, create it normally
    const product = await Product.create({
      name,
      category,
      price: parseFloat(price),
      buyingPrice: parseFloat(buyingPrice),
      description,
      image,
      stock: parseInt(stock, 10),
      code,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
});

// =====================
// GET ALL PRODUCTS
// =====================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

// =====================
// PARTIAL UPDATE PRODUCT (PATCH - Added for clean stock incrementing)
// =====================
router.patch("/:id", async (req, res) => {
  try {
    // Allows updating just 'stock', or any other sub-set of fields sent in req.body
    const updates = { ...req.body };
    
    // Parse numeric fields safely if they are present in the patch payload
    if (updates.price !== undefined) updates.price = parseFloat(updates.price);
    if (updates.buyingPrice !== undefined) updates.buyingPrice = parseFloat(updates.buyingPrice);
    if (updates.stock !== undefined) updates.stock = parseInt(updates.stock, 10);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error patching product:", error);
    res.status(500).json({
      message: "Failed to update product details",
      error: error.message,
    });
  }
});

// =====================
// FULL UPDATE PRODUCT (PUT)
// =====================
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      buyingPrice,
      description,
      image,
      stock,
      code,
    } = req.body;

    if (!name || !category || !price || !buyingPrice || !stock || !code) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price: parseFloat(price),
        buyingPrice: parseFloat(buyingPrice),
        description,
        image,
        stock: parseInt(stock, 10),
        code,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
});

// =====================
// DELETE PRODUCT 
// =====================
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

export default router;



// import express from "express";
// import { Product } from "../models/Product.js";
// import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";

// const router = express.Router();

// // =====================
// // CREATE PRODUCT
// // =====================
// router.post("/",  async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       price,
//       buyingPrice,
//       description,
//       image,
//       stock,
//       code,
//     } = req.body;

//     if (!name || !category || !price || !buyingPrice || !stock || !code) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     const product = await Product.create({
//       name,
//       category,
//       price: parseFloat(price),
//       buyingPrice: parseFloat(buyingPrice),
//       description,
//       image,
//       stock: parseInt(stock, 10),
//       code,
//       // createdBy: req.user._id,
//     });

//     res.status(201).json(product);
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({
//       message: "Failed to create product",
//       error: error.message,
//     });
//   }
// });

// // =====================
// // GET ALL PRODUCTS
// // =====================
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({
//       message: "Failed to fetch products",
//     });
//   }
// });

// // =====================
// // UPDATE PRODUCT
// // =====================
// router.put("/:id", async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       price,
//       buyingPrice,
//       description,
//       image,
//       stock,
//       code,
//     } = req.body;

//     if (!name || !category || !price || !buyingPrice || !stock || !code) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       {
//         name,
//         category,
//         price: parseFloat(price),
//         buyingPrice: parseFloat(buyingPrice),
//         description,
//         image,
//         stock: parseInt(stock, 10),
//         code,
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     res.json(updatedProduct);
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({
//       message: "Failed to update product",
//       error: error.message,
//     });
//   }
// });

// // =====================
// // DELETE PRODUCT 
// // =====================
// router.delete("/:id", protectRoute, async (req, res) => {
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);

//     if (!deletedProduct) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     res.json({
//       message: "Product deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({
//       message: "Failed to delete product",
//       error: error.message,
//     });
//   }
// });

// export default router;




// import express from "express";
// import { Product } from "../models/Product.js";
// // import protectRoute from "../middleware/auth.middleware.js";
// import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";

// const router = express.Router();

// // Create a new product
// router.post("/", protectRoute, async (req, res) => {
//   try {
//     const { name, category, price, buyingPrice, description, image, stock, code} = req.body;

//     if (!name || !category || !price || !buyingPrice || !stock || !code) {
//       return res.status(400).json({ message: "Name, category, and price are required" });
//     }

//     const product = await Product.create({
//       name,
//       category,
//       price,
//       buyingPrice,
//       description,
//       image,
//       stock,
//       code,
//       createdBy: req.user._id,
//     });

//     res.status(201).json(product);
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get all products
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;