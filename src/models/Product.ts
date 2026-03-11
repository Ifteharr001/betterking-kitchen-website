import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  id: string;
  name: { en: string; bn: string; ar: string; es: string; zh: string; fr: string };
  category: string;
  subCategory?: string;
  description: { en: string; bn: string; ar: string; es: string; zh: string; fr: string };
  image: string; 
  gallery?: string[];
  features: { en: string; bn: string; ar: string; es: string; zh: string; fr: string }[];
  specifications: Map<string, string>; 
  highlights: {
    icon: string;
    text: { en: string; bn: string; ar: string; es: string; zh: string; fr: string };
  }[];
}

const ProductSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: {
      en: { type: String, required: true },
      bn: { type: String, default: "" },
      ar: { type: String, default: "" },
      es: { type: String, default: "" },
      zh: { type: String, default: "" },
      fr: { type: String, default: "" },
    },
    category: { type: String, required: true },
    subCategory: { type: String },
    description: {
      en: { type: String, required: true },
      bn: { type: String, default: "" },
      ar: { type: String, default: "" },
      es: { type: String, default: "" },
      zh: { type: String, default: "" },
      fr: { type: String, default: "" },
    },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    features: [{
      en: { type: String },
      bn: { type: String, default: "" },
      ar: { type: String, default: "" },
      es: { type: String, default: "" },
      zh: { type: String, default: "" },
      fr: { type: String, default: "" },
    }],
    specifications: { type: Map, of: String },
    highlights: [{
      icon: { type: String, required: true },
      text: {
        en: { type: String },
        bn: { type: String, default: "" },
        ar: { type: String, default: "" },
        es: { type: String, default: "" },
        zh: { type: String, default: "" },
        fr: { type: String, default: "" },
      }
    }]
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;