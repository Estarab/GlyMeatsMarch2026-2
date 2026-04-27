import mongoose from "mongoose";

const StockMovementSchema = new mongoose.Schema(
  {
    productId: String,
    productName: String,
    quantityAdded: Number,
    type: { type: String, default: "IN" },
    transactionId: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const StockMovement = mongoose.model("StockMovement", StockMovementSchema);

export default StockMovement;



// import mongoose from "mongoose";

// const StockMovementSchema = new mongoose.Schema(
//   {
//     material: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "RawMaterial",
//       required: true,
//     },
//     change: {
//       type: Number,
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: ["PRODUCTION", "PURCHASE", "ADJUSTMENT"],
//       required: true,
//     },
//     reference: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// // Named export
// export const StockMovement = mongoose.model(
//   "StockMovement",
//   StockMovementSchema
// );