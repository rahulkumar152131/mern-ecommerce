import express from "express";
import UserController from "./user.controller.js";
import { upload } from "../../middleware/fileupload.middleware.js";
import { signUpFormValidate } from "../../middleware/expressValidator.js";
const userRouter = express.Router();
const userController = new UserController();
userRouter.post('/sign-up',  upload.single('profileImage'), signUpFormValidate, userController.signUp);
userRouter.post('/sign-in', userController.signIn);
userRouter.post('/send-link', userController.sendLink);
userRouter.put('/reset-password', userController.resetPassword);

export default userRouter;
