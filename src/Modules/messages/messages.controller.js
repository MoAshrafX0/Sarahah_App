import { Router } from "express";
const messageController = Router();
import * as Service from "./messages.service.js";
// messageController.use(ratelimiterMiddleware);

messageController.post("/send/:receiverdId", Service.sendMessages);
messageController.get("/", Service.getMessage);
messageController.get("/private", Service.getPrivateMessage);
messageController.get("/public", Service.getAllPublicMessage);
messageController.get("/private/:id", Service.makePrivateMessage);
messageController.get("/public/:id", Service.makePublicMessage);
messageController.get("/delete/:id", Service.deleteMessage);
messageController.get("/user", Service.getAllMessageUser);

export default messageController;
