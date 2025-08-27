import express from "express";
import { getMessage, getUsers, lastMessage } from "../controller/message.controller.js";
import { auth } from "../middleware/auth.js";

const messageRouter=express.Router();

messageRouter.get("/getUsers",auth,getUsers);
messageRouter.get("/messages/:id",auth,getMessage);
messageRouter.get("/lastMessages/",auth,lastMessage);

export default messageRouter;