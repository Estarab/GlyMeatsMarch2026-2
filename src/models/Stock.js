import mongoose from "mongoose";

const StockSchema = new mongoose.Schema(
  {
    productName: { 
      type: String, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ["stock-in", "stock-out"], 
      default: "stock-in" 
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

const Stock = mongoose.model("Stock", StockSchema);
export default Stock;