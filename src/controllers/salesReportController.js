const SalesReport = require("../models/SalesReport");

// SAVE BULK REPORTS
exports.saveReports = async (req, res) => {
  try {
    const reports = req.body;

    if (!Array.isArray(reports)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    await SalesReport.insertMany(reports);

    res.status(201).json({
      message: "Reports saved successfully",
      count: reports.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};