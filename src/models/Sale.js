import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
  },
  { timestamps: true }
);

// Named export
export const Sale = mongoose.model("Sale", saleSchema);


// import mongoose from "mongoose";

// const saleSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     items: [
//       {
//         product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//         quantity: { type: Number, required: true },
//         price: { type: Number, required: true },
//       },
//     ],
//     total: { type: Number, required: true },
//     paymentMethod: { type: String, enum: ["cash", "card"], default: "cash" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Sale", saleSchema);