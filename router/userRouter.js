import { Router } from "express";
import { UserController } from "../controllers/userController";
export const userRouter = new Router();

userRouter.use("/signin", UserController.createUser);