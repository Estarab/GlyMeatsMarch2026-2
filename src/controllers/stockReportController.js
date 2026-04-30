import StockMovement2 from "../models/stockMovement2.js";

// ================= SAVE =================
export const saveStockReports = async (req, res) => {
  try {
    const stockItems = req.body;

    if (!Array.isArray(stockItems)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const formatted = stockItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantityAdded: item.quantityAdded,
      type: item.type || "IN",
      createdAt: item.createdAt,
      syncStatus: "offline",
    }));

    await StockMovement2.insertMany(formatted);

    res.json({
      message: "Stock saved",
      count: formatted.length,
    });
  } catch (err) {
    console.log("SAVE ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ================= GET =================
export const getStockReports = async (req, res) => {
  try {
    const data = await StockMovement2.find({})
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// import stockMovement2 from "../models/stockMovement2.js";
// import StockMovement2 from "../models/stockMovement2.js";

// // ================= SAVE STOCK =================
// export const saveStockReports = async (req, res) => {
//   try {
//     const stockItems = req.body;

//     if (!Array.isArray(stockItems)) {
//       return res.status(400).json({ message: "Invalid data" });
//     }

//     const formatted = stockItems.map((item) => ({
//       productId: item.productId,
//       productName: item.productName,
//       quantityAdded: item.quantityAdded,
//       type: item.type || "IN",
//       createdAt: item.createdAt,
//     }));

//     await stockMovement2.insertMany(formatted);

//     res.json({
//       message: "Stock reports saved successfully",
//       count: formatted.length,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ================= GET STOCK =================
// export const getStockReports = async (req, res) => {
//   try {
//     const data = await StockMovement.find().sort({ createdAt: -1 });

//     res.json(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };