import { Product } from "../models/Product.js";
import { StockLog } from "../models/StockLog.js";

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, buyingPrice, stock, code } = req.body;

    const product = new Product({
      name,
      category,
      price,
      buyingPrice,
      stock,
      code,
    });

    await product.save();

    // ✅ LOG STOCK (INITIAL STOCK = IN)
    await StockLog.create({
      product: product._id,
      name: product.name,
      quantity: stock,
      type: "IN",
      createdBy: req.user?._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create product" });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.params.id);

    if (!oldProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // ✅ CHECK IF STOCK CHANGED
    if (req.body.stock !== undefined) {
      const difference = req.body.stock - oldProduct.stock;

      if (difference !== 0) {
        await StockLog.create({
          product: updatedProduct._id,
          name: updatedProduct.name,
          quantity: Math.abs(difference),
          type: difference > 0 ? "IN" : "OUT",
          createdBy: req.user?._id,
        });
      }
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to update product" });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to delete product" });
  }
};




// import { Product } from "../models/Product.js";

// // GET /api/products
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch products" });
//   }
// };

// // POST /api/products
// export const createProduct = async (req, res) => {
//   try {
//     const { name, category, price, buyingPrice,  stock, code } = req.body;
//     const product = new Product({ name, category, price, buyingPrice,  stock, code });
//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Failed to create product" });
//   }
// };



// // PUT /api/products/:id
// export const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Failed to update product" });
//   }
// };

// // DELETE /api/products/:id
// export const deleteProduct = async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Product deleted" });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Failed to delete product" });
//   }
// };