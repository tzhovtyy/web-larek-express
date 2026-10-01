import { Router } from 'express';
import { createOrder } from '../controllers/orders';
import { validateOrderBody } from '../middlewares/validation';

const orderRouter = Router();

orderRouter.post('/', validateOrderBody, createOrder);

export default orderRouter;
