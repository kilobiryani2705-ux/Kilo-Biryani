import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  image: string;
  prices: {
    plate: number;
    kg: number;
    halfKg: number;
  };
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    prices: {
      plate: { type: Number, required: true },
      kg: { type: Number, required: true },
      halfKg: { type: Number, required: true },
    },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
