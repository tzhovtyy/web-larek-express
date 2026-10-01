import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import Product from '../models/product';
import { moveImageFromTemp, removeImage } from '../utils/files';

const handleProductError = (error: unknown, next: NextFunction) => {
  if (error instanceof Error && error.message.includes('E11000')) {
    return next(new ConflictError('Товар с таким заголовком уже существует'));
  }

  if (error instanceof MongooseError.ValidationError) {
    return next(new BadRequestError(error.message));
  }

  return next(error);
};

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    return res.send({ items: products, total: products.length });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { title, image, category, description, price } = req.body;
  // prevent rolling back an unrelared file
  let rollbackFileName: string | null = null;

  try {
    const { fileName, moved } = await moveImageFromTemp(image.fileName);
    if (moved) {
      rollbackFileName = fileName;
    }

    const product = await Product.create({
      title,
      image: { fileName, originalName: image.originalName },
      category,
      description,
      price,
    });

    return res.status(201).send(product);
  } catch (error) {
    if (rollbackFileName) {
      await removeImage(rollbackFileName).catch(() => {});
    }

    return handleProductError(error, next);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { image, ...rest } = req.body;
  let rollbackFileName: string | null = null;

  try {
    const update: Record<string, unknown> = { ...rest };
    let replacedFileName: string | null = null;

    if (image) {
      const previous = await Product.findById(productId).lean();
      const { fileName, moved } = await moveImageFromTemp(image.fileName);
      if (moved) {
        rollbackFileName = fileName;
      }
      update.image = { fileName, originalName: image.originalName };

      if (previous?.image?.fileName && previous.image.fileName !== fileName) {
        replacedFileName = previous.image.fileName;
      }
    }

    const product = await Product.findByIdAndUpdate(productId, update, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new NotFoundError('Товар не найден');
    }

    if (replacedFileName) {
      await removeImage(replacedFileName).catch(() => {});
    }

    return res.send(product);
  } catch (error) {
    if (rollbackFileName) {
      await removeImage(rollbackFileName).catch(() => {});
    }

    return handleProductError(error, next);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return next(new NotFoundError('Товар не найден'));
    }

    return res.send(product);
  } catch (error) {
    return handleProductError(error, next);
  }
};
