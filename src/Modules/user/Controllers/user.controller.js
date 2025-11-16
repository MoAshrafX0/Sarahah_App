import { Router } from "express";
const userController = Router();
import {
  deleteAccount,
  getAllUsers,
  updateAccount,
  uploadPic,
} from "../Services/user.service.js";
import  {authentiactionMiddleware}  from "../../../Middlewares/authentication.middleware.js"
import { cloudinaryUpload } from "../../../Middlewares/multer.middleware.js";
import { updatePasswordSchema, updateProfileSchema } from "../../../Validators/Schemas/user.schema.js";
//========================>  user routes <====================================

userController.put("/update", validatorMiddleware(updateProfileSchema), authentiactionMiddleware, updateAccount);

userController.delete("/delete", authentiactionMiddleware, deleteAccount);

userController.post("/upload-pic", authentiactionMiddleware,cloudinaryUpload({}).single("profile"), uploadPic);

userController.put("/update-password", validatorMiddleware(updatePasswordSchema), authentiactionMiddleware, updatePassword);

//========================> admin routes <====================================

userController.get("/list", getAllUsers);

export default userController;
