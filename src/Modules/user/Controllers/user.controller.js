import { Router } from "express";
const userController = Router();
import {
  deleteAccount,
  getAllUsers,
  updateAccount,
  uploadPic,
} from "../Services/user.service.js";
import  {authentiactionMiddleware}  from "../../../Middlewares/authentication.middleware.js"
import { roleEnum } from "../../../common/enums/user.enum.js";
import { cloudinaryUpload, localUpload } from "../../../Middlewares/multer.middleware.js";
//========================>  user routes <====================================

userController.put("/update", authentiactionMiddleware, updateAccount);

userController.delete("/delete", authentiactionMiddleware, deleteAccount);

userController.post("/upload-pic", authentiactionMiddleware,cloudinaryUpload({}).single("profile"), uploadPic);

//========================> admin routes <====================================

userController.get("/list", getAllUsers);

export default userController;
