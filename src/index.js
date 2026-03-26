import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "./lib/cron.js";

import { connectDB } from "./lib/db.js";

// =====================
// EXISTING ROUTES
// =====================
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import pettyCashRoutes from "./routes/pettyCashRoutes.js";

// =====================
// NEW PRODUCTION MODULE
// =====================
import productionRoutes from "./routes/productionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import planRoutes from "./routes/planRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// =====================
// CRON JOBS
// =====================
job.start();

// =====================
// API ROUTES
// =====================

// ---------- AUTH ----------
app.use("/api/auth", authRoutes);

// ---------- DEMO BOOKS ----------
app.use("/api/books", bookRoutes);

// ---------- POS ----------
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

// ---------- PETTY CASH ----------
app.use("/api/pettycash", pettyCashRoutes);

// =====================
// MANUFACTURING / PRODUCTION
// =====================

// raw materials inventory
app.use("/api/materials", materialRoutes);

// product recipes / bill of materials
app.use("/api/recipes", recipeRoutes);

// create and process production batches
app.use("/api/production", productionRoutes);

// production planning calendar
app.use("/api/plans", planRoutes);

// reporting & analytics
app.use("/api/reports", reportRoutes);

// =====================
// HEALTH CHECK
// =====================
app.get("/", (req, res) => {
  res.send("POS + Manufacturing API is running");
});

// =====================
// ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

// =====================
// START SERVER
// =====================
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDB();
});




// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import job from "./lib/cron.js";

// import authRoutes from "./routes/authRoutes.js";
// import bookRoutes from "./routes/bookRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import saleRoutes from "./routes/saleRoutes.js";
// import pettyCashRoutes from "./routes/pettyCashRoutes.js";

// import { connectDB } from "./lib/db.js";

// const app = express();
// const PORT = process.env.PORT || 3000;

// job.start();
// app.use(express.json());
// app.use(cors());

// // existing routes
// app.use("/api/auth", authRoutes);
// app.use("/api/books", bookRoutes);

// // POS routes
// app.use("/api/products", productRoutes);
// app.use("/api/sales", saleRoutes);

// //petty cash
// app.use("/api/pettycash", pettyCashRoutes);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   connectDB();
// });



// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import job from "./lib/cron.js";

// import authRoutes from "./routes/authRoutes.js";
// import bookRoutes from "./routes/bookRoutes.js";

// import { connectDB } from "./lib/db.js";

// const app = express();
// const PORT = process.env.PORT || 3000;

// job.start();
// app.use(express.json());
// app.use(cors());

// app.use("/api/auth", authRoutes);
// app.use("/api/books", bookRoutes);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   connectDB();
// });
