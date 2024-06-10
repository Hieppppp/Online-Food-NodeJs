import express from 'express';
import { getUser, loginUser, resetPassword, resgisterUser, updatePassword } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router()

userRouter.get("/get-list-user",authMiddleware,getUser);
userRouter.post("/resgister",resgisterUser);
userRouter.post("/login",loginUser);
userRouter.post("/reset-password",resetPassword);
userRouter.post("/update-password",updatePassword);


export default userRouter;