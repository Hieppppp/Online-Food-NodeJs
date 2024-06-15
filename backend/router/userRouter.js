import express from 'express';
import { getAllUser, getUser, loginUser, resetPassword, resgisterUser, updatePassword } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router()

userRouter.get("/get-list-user",authMiddleware,getUser);
userRouter.get("/get-all-user",getAllUser);
userRouter.post("/resgister",resgisterUser);
userRouter.post("/login",loginUser);
userRouter.post("/reset-password",resetPassword);
userRouter.post("/update-password",updatePassword);


export default userRouter;