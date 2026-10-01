import { Router } from 'express';
import { createOrder } from '../controllers/orders';

const orderRouter = Router();

orderRouter.post('/', createOrder);

export default orderRouter;
