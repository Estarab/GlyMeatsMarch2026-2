const mongoose = require("mongoose");

const mobileMoneyTransactionSchema = new mongoose.Schema(
  {
    // Unique client-generated ID makes offline retries idempotent.
    transactionId: { type: String, required: true, unique: true, trim: true },
    transactionReference: { type: String, trim: true, default: "" },
    provider: {
      type: String,
      enum: ["AIRTEL_MONEY", "MTN_MOMO", "ZAMTEL_KWACHA", "OTHER"],
      required: true,
    },
    payerName: { type: String, trim: true, default: "" },
    payerPhone: { type: String, trim: true, default: "" },

    // Record the split, but count the incoming payment only once.
    productAmount: { type: Number, required: true, min: 0 },
    parcelAmount: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    // Optional link to the existing POS sale / order.
    saleTransactionId: { type: String, trim: true, default: "" },
    parcelNumber: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
    recordedBy: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["RECEIVED", "REVERSED"],
      default: "RECEIVED",
      index: true,
    },
    receivedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

mobileMoneyTransactionSchema.index({ receivedAt: -1 });
mobileMoneyTransactionSchema.index({ transactionReference: 1 });
mobileMoneyTransactionSchema.index({ saleTransactionId: 1 });

module.exports =
  mongoose.models.MobileMoneyTransaction ||
  mongoose.model("MobileMoneyTransaction", mobileMoneyTransactionSchema);
