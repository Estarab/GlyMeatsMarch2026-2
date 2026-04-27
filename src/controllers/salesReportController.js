import SalesReport from "../models/SalesReport.js";

export const saveReports = async (req, res) => {
  try {
    const sales = req.body;

    // 🔥 FIX: ensure it's array
    if (!Array.isArray(sales)) {
      return res.status(400).json({
        message: "Invalid data format. Expected an array of sales.",
      });
    }

    const formatted = sales.map((sale) => ({
  date: sale.date,
  time: sale.time,
  items: sale.items,
  total: sale.total,
  paymentMethod: sale.paymentMethod,
}));

    // await SalesReport.insertMany(formatted);
    await SalesReport.insertMany(formatted, { ordered: false });

    res.status(201).json({
      message: "Sales synced successfully",
      count: formatted.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};