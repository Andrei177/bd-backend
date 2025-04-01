import { Router } from "express";
import { userRouter } from "./userRouter";

export const router = new Router();

router.use("/user", userRouter)