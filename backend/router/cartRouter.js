import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post("/addToCart",authMiddleware,addToCart);
cartRouter.post("/getCart",authMiddleware,getCart);
cartRouter.post("/removeCart",authMiddleware,removeFromCart);

export default cartRouter;