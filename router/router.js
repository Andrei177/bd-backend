import { Router } from "express";
import { userRouter } from "./userRouter.js";
import { authRouter } from "./authRouter.js";

export const router = new Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);