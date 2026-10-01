import mongoose, { Schema } from 'mongoose';

export interface IProductImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  title: string;
  image: IProductImage;
  category: string;
  description?: string;
  price: number | null;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 30,
    },
    image: {
      fileName: {
        type: String,
        required: true,
      },
      originalName: {
        type: String,
        required: true,
      },
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: null,
    },
  },
  { versionKey: false },
);

export default mongoose.model<IProduct>('product', productSchema);
