import User from "../../../DB/Models/user.model.js";
import { customAlphabet } from "nanoid";
import Messages from "../../../DB/Models/messages.model.js";
import { asyncDecrypt } from "../../../Utils/encryption.util.js";
import { deleteFileOnCloudinary, uploadFileOnCloudinary } from "../../../common/Services/cloudinary.service.js";
import mongoose from "mongoose";

// =============================> update user by id <====================================
export const updateAccount = async (req, res) => {

  const {
    user: { _id },
  } = req.loggedInUesr;
  const { firstName, lastName, age, gender, email } = req.body;
  const user = await User.findById(_id);
  if (!user) {
    return res.status(401).json({ message: "User Not found" });
  }
  

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) {
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(409).json({ message: "Email already exists" });
    }
    user.email = email;
  }
  if (age) user.age = age;
  if (gender) user.gender = gender;
  await user.save();
  res.status(200).json({ message: "User updated successfully", user });
};
// =============================> delete user by id <====================================
export const deleteAccount = async (req, res) => {
  //Start sesion
  const session = await mongoose.startSession();
  req.session = session;
  const {
    user: { _id },
  } = req.loggedInUesr;
  // start Transaction
 await session.startTransaction();
  const deletedUser = await User.findByIdAndDelete(_id, { session });
  await Messages.deleteMany({ receiverdId: _id }, { session });
// delete by public Id 
  await deleteFileOnCloudinary(deletedUser.profilePic.public_id);
  
  //   //unlinke profile pic
  // if(deletedUser.profilePic){
  //   fs.unlinkSync(deletedUser.profilePic);
  // }
  // commitTransaction
  await session.commitTransaction();

  

  //  endSession
  session.endSession();
  res.status(200).json({ message: "User deleted successfully" ,deletedUser});
};
// =============================> Get all users   <====================================
export const getAllUsers = async (req, res) => {
  let users = await User.find("-password").populate("Messages");

  users = users.map((user) => {
    return { ...user._doc, phoneNumber: asyncDecrypt(user.phoneNumber) };
  });
  res.status(200).json({ message: "Users retrieved successfully", users });
};

// =============================> Multer Upload Pic <====================================
export const uploadPic = async (req, res) => {
  const {
    user: { _id },
  } = req.loggedInUesr;
  
  
  
  const { path } = req.file;
  const user = await User.findById(_id);

  const {secure_url,public_id} = await uploadFileOnCloudinary(path,{

    folder:"Sarahah_App/Users/Profile_Pics",
    
  });
  
  user.profilePic = {
    secure_url,
    public_id
  }
  await user.save();
  res
    .status(200)
    .json({ message: "Pic uploaded successfully" });
};


