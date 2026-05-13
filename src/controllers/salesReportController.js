import SalesReport from "../models/SalesReport.js";

/**
 * =========================
 * SAVE BULK SALES (SYNC FROM POS)
 * =========================
 */
export const saveReports = async (req, res) => {
  try {
    const sales = req.body;

    // ✅ Validate input
    if (!Array.isArray(sales)) {
      return res.status(400).json({
        message: "Invalid data format. Expected an array of sales.",
      });
    }

    // ✅ Format safely before saving
    const formatted = sales.map((sale) => ({
      transactionId:
        sale.transactionId || `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,

      date: sale.date || new Date().toISOString(),
      time: sale.time || new Date().toLocaleTimeString(),

      items: Array.isArray(sale.items) ? sale.items : [],

      subtotal: sale.subtotal || 0,
      discount: sale.discount || 0,

      total: sale.total || 0,
      paymentMethod: sale.paymentMethod || "cash",

      syncStatus: sale.syncStatus || "synced",
    }));

    // ✅ Insert into MongoDB
    await SalesReport.insertMany(formatted, { ordered: false });

    return res.status(201).json({
      message: "Sales synced successfully",
      count: formatted.length,
    });
  } catch (err) {
    console.log("SAVE REPORT ERROR:", err);

    return res.status(500).json({
      message: "Server error while saving reports",
      error: err.message,
    });
  }
};

/**
 * =========================
 * GET ALL SALES REPORTS
 * =========================
 */
export const getReports = async (req, res) => {
  try {
    const reports = await SalesReport.find().sort({ createdAt: -1 });

    return res.json({
      count: reports.length,
      data: reports,
    });
  } catch (err) {
    console.log("GET REPORT ERROR:", err);

    return res.status(500).json({
      message: "Failed to fetch reports",
      error: err.message,
    });
  }
};

/**
 * =========================
 * OPTIONAL: GET SINGLE REPORT
 * =========================
 */
export const getReportById = async (req, res) => {
  try {
    const report = await SalesReport.findOne({
      transactionId: req.params.id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    return res.json(report);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching report",
      error: err.message,
    });
  }
};

/**
 * =========================
 * OPTIONAL: DELETE REPORT
 * =========================
 */
export const deleteReport = async (req, res) => {
  try {
    const deleted = await SalesReport.findOneAndDelete({
      transactionId: req.params.id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    return res.json({
      message: "Report deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting report",
      error: err.message,
    });
  }
};



// import SalesReport from "../models/SalesReport.js";

// export const saveReports = async (req, res) => {
//   try {
//     const sales = req.body;

//     // 🔥 FIX: ensure it's array
//     if (!Array.isArray(sales)) {
//       return res.status(400).json({
//         message: "Invalid data format. Expected an array of sales.",
//       });
//     }

//     const formatted = sales.map((sale) => ({
//   date: sale.date,
//   time: sale.time,
//   items: sale.items,
//   total: sale.total,
//   paymentMethod: sale.paymentMethod,
// }));

//     // await SalesReport.insertMany(formatted);
//     await SalesReport.insertMany(formatted, { ordered: false });

//     res.status(201).json({
//       message: "Sales synced successfully",
//       count: formatted.length,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ NEW: GET REPORTS
// export const getReports = async (req, res) => {
//   try {
//     const reports = await SalesReport.find().sort({ createdAt: -1 });
//     res.json(reports);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };