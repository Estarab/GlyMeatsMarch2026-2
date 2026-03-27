import { Product } from "../models/Product.js";

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
    const { name, category, price, stock, code } = req.body;
    const product = new Product({ name, category, price, stock, code });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create product" });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
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