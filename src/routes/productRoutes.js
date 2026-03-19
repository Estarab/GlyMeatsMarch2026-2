import express from "express";
import Product from "../models/Product.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a new product
router.post("/", protectRoute, async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Name, category, and price are required" });
    }

    const product = await Product.create({
      name,
      category,
      price,
      description,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;