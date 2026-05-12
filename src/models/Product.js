import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    buyingPrice: { type: Number, required: true, },
    description: { type: String },
    image: { type: String }, // optional base64 or URL
    stock: { type: Number, default: 0 }, // stock quantity
    code: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{4}$/, // exactly 4 digits
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  { timestamps: true }
);

// Named export
export const Product = mongoose.model("Product", productSchema);


// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     price: { type: Number, required: true },
//     description: { type: String },
//     image: { type: String }, // optional base64 or URL
//     stock: { type: Number, default: 0 }, // new: stock quantity
//     code: { 
//       type: String, 
//       required: true, 
//       unique: true,
//       match: /^[0-9]{4}$/, // exactly 4 digits
//     },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Product", productSchema);



// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     price: { type: Number, required: true },
//     image: { type: String }, // base64 or URL
//     description: { type: String },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Product", productSchema);