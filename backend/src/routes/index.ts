import { Router } from 'express';
import productRouter from './products';

const router = Router();

router.use('/product', productRouter);

export default router;
