import { NextFunction, Request, Response, Router } from 'express';
import NotFoundError from '../errors/not-found-error';
import orderRouter from './order';
import productRouter from './product';

const router = Router();

router.use('/product', productRouter);
router.use('/order', orderRouter);
router.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default router;
