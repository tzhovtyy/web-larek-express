import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    return res.send({ items: products, total: products.length });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, image, category, description, price } = req.body;
    const product = await Product.create({ title, image, category, description, price });
    return res.status(201).send(product);
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }

    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }

    return next(error);
  }
};
