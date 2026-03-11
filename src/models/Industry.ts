import mongoose from "mongoose";

const IndustrySchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      bn: { type: String, default: "" },
      ar: { type: String, default: "" },
      es: { type: String, default: "" },
      zh: { type: String, default: "" },
      fr: { type: String, default: "" },
    },
    description: {
      en: { type: String, required: true },
      bn: { type: String, default: "" },
      ar: { type: String, default: "" },
      es: { type: String, default: "" },
      zh: { type: String, default: "" },
      fr: { type: String, default: "" },
    },
    image: { type: String, required: true },
    details: {
      en: { type: String, default: "" },
      bn: { type: String, default: "" },
      ar: { type: String, default: "" },
      es: { type: String, default: "" },
      zh: { type: String, default: "" },
      fr: { type: String, default: "" },
    }, 
  },
  { timestamps: true }
);

IndustrySchema.index({ createdAt: -1 }); 
IndustrySchema.index({ "name.en": 1 }); 

const Industry = mongoose.models.Industry || mongoose.model("Industry", IndustrySchema);

export default Industry;