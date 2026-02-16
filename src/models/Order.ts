import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String },
    companyName: { type: String },
    productName: { type: String },
    status: { 
      type: String, 
      enum: ["pending", "processing", "delivered", "cancelled"], 
      default: "pending" 
    },
    amount: { type: Number, default: 0 }, 
    details: { type: Object },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;