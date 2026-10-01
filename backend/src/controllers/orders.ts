/* eslint-disable import/prefer-default-export */
import { faker } from '@faker-js/faker';
import { NextFunction, Request, Response } from 'express';
import { isValidObjectId, Types } from 'mongoose';
import validator from 'validator';
import Product from '../models/product';

const PAYMENT_METHODS = ['card', 'online'];

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payment, email, phone, address, total, items } = req.body;

    if (!PAYMENT_METHODS.includes(payment)) {
      return res.status(400).send({ message: 'Поле payment должно быть card или online' });
    }

    if (typeof email !== 'string' || !validator.isEmail(email)) {
      return res.status(400).send({ message: 'Поле email должно быть валидным email' });
    }

    if (typeof phone !== 'string' || phone.trim().length === 0) {
      return res.status(400).send({ message: 'Поле phone обязательно' });
    }

    if (typeof address !== 'string' || address.trim().length === 0) {
      return res.status(400).send({ message: 'Поле address обязательно' });
    }

    if (typeof total !== 'number' || !Number.isFinite(total)) {
      return res.status(400).send({ message: 'Поле total должно быть числом' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).send({ message: 'Поле items должно быть непустым массивом' });
    }

    if (!items.every((id) => isValidObjectId(id))) {
      return res
        .status(400)
        .send({ message: 'Поле items должно содержать корректные _id товаров' });
    }

    const products = await Product.find({ _id: { $in: items } });
    const pricesById = new Map(
      products.map((product) => [String(product._id as Types.ObjectId), product.price]),
    );

    const notFound = items.filter((id) => !pricesById.has(String(id)));
    if (notFound.length > 0) {
      return res.status(400).send({ message: `Товар не найден` });
    }

    const notForSale = items.filter((id) => pricesById.get(String(id)) === null);
    if (notForSale.length > 0) {
      return res.status(400).send({ message: `Товар не продаётся` });
    }

    const sum = items.reduce((acc, id) => acc + (pricesById.get(String(id)) as number), 0);
    if (sum !== total) {
      return res.status(400).send({ message: 'Поле total не совпадает со стоимостью товаров' });
    }

    return res.status(201).send({ id: faker.string.uuid(), total });
  } catch (error) {
    return next(error);
  }
};
