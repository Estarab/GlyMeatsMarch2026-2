import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "./lib/cron.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import pettyCashRoutes from "./routes/pettyCash.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

job.start();
app.use(express.json());
app.use(cors());

// existing routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// POS routes
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

//petty cash
app.use("/api/pettycash", pettyCashRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});



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
