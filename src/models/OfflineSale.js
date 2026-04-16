import mongoose from "mongoose";

const offlineSaleSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      default: "offline-sync",
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },

    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        productName: String,
        quantity: Number,
        price: Number,
        lineTotal: Number,
      },
    ],

    syncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const OfflineSale = mongoose.model("OfflineSale", offlineSaleSchema);