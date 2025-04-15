import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
export const userRouter = new Router();

userRouter.post("/signup", UserController.signup);
userRouter.post("/signin", UserController.signin);