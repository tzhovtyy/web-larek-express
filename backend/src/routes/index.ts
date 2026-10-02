import { NextFunction, Request, Response, Router } from 'express';
import NotFoundError from '../errors/not-found-error';
import authRouter from './auth';
import orderRouter from './order';
import productRouter from './product';
import uploadRouter from './upload';

const router = Router();

router.use('/auth', authRouter);
router.use('/product', productRouter);
router.use('/order', orderRouter);
router.use('/upload', uploadRouter);
router.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default router;
