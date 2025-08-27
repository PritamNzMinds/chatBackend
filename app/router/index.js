import express from "express";
import authRouter from "./auth.router.js";
import messageRouter from "./message.router.js";

const router=express.Router();

router.use(authRouter);
router.use(messageRouter);

export default router;