import { Router } from 'express';
import orderRouter from './orders';
import productRouter from './products';

const router = Router();

router.use('/product', productRouter);
router.use('/order', orderRouter);

export default router;
