import StockMovement from "../models/StockMovement.js";

// ================= BULK SYNC STOCK =================
export const bulkUploadStock = async (req, res) => {
  try {
    const stockData = req.body;

    if (!Array.isArray(stockData)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    await StockMovement.insertMany(stockData);

    return res.json({
      message: "Stock synced successfully",
      count: stockData.length,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL STOCK =================
export const getStock = async (req, res) => {
  try {
    const data = await StockMovement.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching stock" });
  }
};