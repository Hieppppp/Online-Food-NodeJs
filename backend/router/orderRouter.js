import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { getOrderDetailByUserId, getOrderId, listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from '../controllers/orderController.js';


const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",authMiddleware,verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/listorders",listOrders);
orderRouter.post("/status",updateStatus);
orderRouter.get("/oderdetail/:id",getOrderId);
orderRouter.get("/orderdetailbyuser/:id",getOrderDetailByUserId);

export default orderRouter;