import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantityAdded: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      default: "IN",
      enum: ["IN", "OUT"], // future-proof
    },
    syncStatus: {
      type: String,
      default: "offline", // for your sync logic
    },
  },
  {
    timestamps: true, // ✅ creates createdAt & updatedAt
  }
);

// ✅ FORCE EXACT COLLECTION NAME: stockmovement2
export default mongoose.model(
  "StockMovement2",
  stockSchema,
  "stockmovement2"
);



// import mongoose from "mongoose";

// const stockSchema = new mongoose.Schema(
//   {
//     productId: String,
//     productName: String,
//     quantityAdded: Number,
//     type: { type: String, default: "IN" },
//   },
//   { timestamps: true } // ✅ Mongo will auto-create createdAt
// );

// // ✅ MATCH YOUR CONTROLLER IMPORT
// export default mongoose.model("StockMovement2", stockSchema);