const saleSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      unique: true, // 🔥 prevents duplicate sync
      required: true,
    },

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
        quantity: Number,
        price: Number,
      },
    ],

    total: Number,

    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },

    synced: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);