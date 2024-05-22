import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { listOrders, placeOrder, userOrders, verifyOrder } from '../controllers/orderController.js';


const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",authMiddleware,verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/listorders",listOrders);

export default orderRouter;