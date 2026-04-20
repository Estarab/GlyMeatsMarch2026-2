const express = require("express");
const router = express.Router();

const {
  saveReports,
} = require("../controllers/salesReportController");

// POST /api/reports/save
router.post("/save", saveReports);

module.exports = router;