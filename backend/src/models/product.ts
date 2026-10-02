import mongoose, { Schema } from 'mongoose';
import { removeImage } from '../utils/files';

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
      unique: true,
      required: [true, 'Поле "title" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "title" - 2'],
      maxlength: [30, 'Максимальная длина поля "title" - 30'],
    },
    image: {
      fileName: {
        type: String,
        required: [true, 'Поле "image.fileName" должно быть заполнено'],
        minlength: [2, 'Минимальная длина поля "image.fileName" - 2'],
        maxlength: [255, 'Максимальная длина поля "image.fileName" - 255'],
      },
      originalName: {
        type: String,
        required: [true, 'Поле "image.originalName" должно быть заполнено'],
        minlength: [2, 'Минимальная длина поля "image.originalName" - 2'],
        maxlength: [255, 'Максимальная длина поля "image.originalName" - 255'],
      },
    },
    category: {
      type: String,
      required: [true, 'Поле "category" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "category" - 2'],
      maxlength: [30, 'Максимальная длина поля "category" - 30'],
    },
    description: {
      type: String,
      minlength: [2, 'Минимальная длина поля "description" - 2'],
      maxlength: [1000, 'Максимальная длина поля "description" - 1000'],
    },
    price: {
      type: Number,
      default: null,
    },
  },
  { versionKey: false },
);

productSchema.post('findOneAndDelete', async (doc: IProduct | null) => {
  if (doc?.image?.fileName) {
    await removeImage(doc.image.fileName).catch(() => {});
  }
});

productSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function removeProductImage() {
    if (this.image?.fileName) {
      await removeImage(this.image.fileName).catch(() => {});
    }
  },
);

export default mongoose.model<IProduct>('product', productSchema);
