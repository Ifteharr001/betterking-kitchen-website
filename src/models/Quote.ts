import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    productName: { type: String, required: true },
    productImage: { type: String },

    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    companyName: { type: String },
    
    businessType: { type: String },
    hotelStarRating: { type: String },
    kitchenSize: { type: String },
    seatingCapacity: { type: String },
    openingDate: { type: String },
    dailyProduction: { type: String },
    
    layoutImage: { type: String },
    
    message: { type: String },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    invoiceUrl: { type: String },
  },
  { timestamps: true }
);

const Quote = mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);

export default Quote;