import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

export const authRouter = new Router();

authRouter.get("/refresh", AuthController.refresh);