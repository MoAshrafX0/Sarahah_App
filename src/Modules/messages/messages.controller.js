import { Router } from "express";
const messageController = Router();
import * as Service from "./messages.service.js";
import { messageSchema } from "../../Validators/Schemas/message.schema.js";


messageController.post("/send/:receiverdId", validatorMiddleware(messageSchema), Service.sendMessages);
messageController.get("/", Service.getMessage);
messageController.get("/private", Service.getPrivateMessage);
messageController.get("/public", Service.getAllPublicMessage);
messageController.get("/private/:id", Service.makePrivateMessage);
messageController.get("/public/:id", Service.makePublicMessage);
messageController.get("/delete/:id", Service.deleteMessage);
messageController.get("/user", Service.getAllMessageUser);

export default messageController;
