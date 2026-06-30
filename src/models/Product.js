import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // Product Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Category
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Product Description
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Selling Price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Buying Price
    buyingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Current Stock
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Unique Product Code
    code: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{4}$/,
    },

    // Product Images (Maximum 3)
    images: {
      type: [imageSchema],
      validate: {
        validator: function (images) {
          return images.length <= 3;
        },
        message: "Maximum of 3 images allowed.",
      },
      default: [],
    },

    // Featured Product
    featured: {
      type: Boolean,
      default: false,
    },

    // Average Rating
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Number of Reviews
    reviews: {
      type: Number,
      default: 0,
    },

    // Total Units Sold
    totalSales: {
      type: Number,
      default: 0,
    },

    // Product Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // User who created the product
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);



// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     price: { type: Number, required: true },
//     buyingPrice: { type: Number, required: true, },
//     description: { type: String },
//     image: { type: String }, // optional base64 or URL
//     stock: { type: Number, default: 0 }, // stock quantity
//     code: {
//       type: String,
//       required: true,
//       unique: true,
//       match: /^[0-9]{4}$/, // exactly 4 digits
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: false,
//       default: null,
//     },
//     // createdBy: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   ref: "User",
//     //   required: true,
//     // },
//   },
//   { timestamps: true }
// );

// // Named export
// export const Product = mongoose.model("Product", productSchema);


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