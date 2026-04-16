import mongoose from "mongoose";

const offlineSaleSchema = new mongoose.Schema(
  {
    deviceId: String, // optional tracking
    total: Number,
    paymentMethod: String,

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        quantity: Number,
        price: Number,
      },
    ],

    synced: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const OfflineSale = mongoose.model("OfflineSale", offlineSaleSchema);