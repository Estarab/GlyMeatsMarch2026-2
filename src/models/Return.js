import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
     quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Return = mongoose.model("Return", returnSchema);

export default Return;