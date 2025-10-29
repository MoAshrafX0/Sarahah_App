import { Router } from "express";
const authController = Router();
import { confirmEmail, login, logout, refreshTokenService, siginUp, siginUpWithGoogle } from "../Services/auth.service.js";
import { authentiactionMiddleware } from "../../../Middlewares/authentication.middleware.js";

import { validatorMiddleware } from "../../../Middlewares/Validator.middleware.js";
import { siginUpSchema } from "../../../Validators/Schemas/user.schema.js";

//========================> auth routes <====================================
authController.post("/add" ,validatorMiddleware(siginUpSchema),siginUp);
authController.get("/confirm", confirmEmail);
authController.post("/login", login);
authController.post("/refreshtoken", refreshTokenService);
authController.post("/logout", authentiactionMiddleware, logout);
authController.post("/auth-gmail", siginUpWithGoogle); 


export default authController;
