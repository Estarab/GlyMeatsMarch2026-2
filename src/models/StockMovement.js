import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    productId: String,
    productName: String,
    quantityAdded: Number,
    type: { type: String, default: "IN" },
    createdAt: String,
  },
  { timestamps: true }
);

export default mongoose.model("StockMovement", stockSchema);



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