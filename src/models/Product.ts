import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string; 
  gallery?: string[];
  features: string[];
  specifications: Map<string, string>; 
  highlights: {
    icon: string;
    text: string;
  }[];
}

const ProductSchema: Schema = new Schema(
  {
    id: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      required: true,
      uppercase: true
    },
    price: { 
      type: String, 
      default: "Contact for Price" 
    },
    description: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
      gallery: [
        {
          type: String,
        }
      ],
    features: [
      { 
        type: String 
      }
    ],
    specifications: {
      type: Map,
      of: String,
    },
    highlights: [
      {
        icon: { type: String, required: true }, 
        text: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;