import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body;

    const products = await Product.find({ _id: { $in: items } });
    const pricesById = new Map(
      products.map((product) => [String(product._id as Types.ObjectId), product.price]),
    );

    const notFound = items.filter((id: string) => !pricesById.has(id));
    if (notFound.length > 0) {
      return next(new BadRequestError(`Товар с _id ${notFound[0]} не найден`));
    }

    const notForSale = items.filter((id: string) => pricesById.get(id) === null);
    if (notForSale.length > 0) {
      return next(new BadRequestError(`Товар с _id ${notForSale[0]} не продаётся`));
    }

    const sum = items.reduce((acc: number, id: string) => acc + (pricesById.get(id) as number), 0);
    if (sum !== total) {
      return next(new BadRequestError('Поле total не совпадает со стоимостью товаров'));
    }

    return res.status(201).send({ id: faker.string.uuid(), total });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
