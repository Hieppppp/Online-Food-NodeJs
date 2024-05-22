import express from 'express';
import { loginUser, resgisterUser } from '../controllers/userController.js';

const userRouter = express.Router()

userRouter.post("/resgister",resgisterUser);
userRouter.post("/login",loginUser);

export default userRouter;