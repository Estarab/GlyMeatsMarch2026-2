import Stock from "../models/Stock.js";

// Get all stock logs for the report
export const getStockLogs = async (req, res) => {
  try {
    const logs = await Stock.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a new stock log entry
export const createStockLog = async (req, res) => {
  try {
    const { productName, quantity, type } = req.body;

    if (!productName || !quantity) {
      return res.status(400).json({ message: "Missing product name or quantity" });
    }

    const newLog = await Stock.create({
      productName,
    quantity: parseFloat(quantity),
      type: type || "stock-in",
    });

    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};