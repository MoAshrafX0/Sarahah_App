import  {  Router } from "express";
const messageController = Router();
import* as Service from "./messages.service.js";
// messageController.use(ratelimiterMiddleware);

messageController.post('/send/:receiverdId',Service.sendMessages)
messageController.get('/',Service.getMessage)


export default messageController;