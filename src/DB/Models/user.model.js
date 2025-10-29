//======================================> User model <=================================
import mongoose from "mongoose";
import { genderEnum, roleEnum ,providerEnum} from "../../common/enums/user.enum.js";

//  ==============================> user schema definition <=======================================
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters"],
      maxLength: [30, "First name must be at most 30 characters"],
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters"],
      maxLength: [30, "First name must be at most 30 characters"],
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      min: [18, " Age must be at least 18"],
      max: [100, " Age must be at most 100 "],
    },
    gender: {
      type: String,
      enum: Object.values(genderEnum),

      default: genderEnum.MALE,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
       type: String, 
       enum: Object.values(roleEnum), 
       default: roleEnum.USER
       },

    phoneNumber: {
      type: String,
      unique: true,
    },
    isconfirmed: { type: Boolean, default: false },
    otps: {
      confirmation: { type: String, default: null },
      resetPassword: { type: String, default: null },
      changePhoneNumber: { type: String, default: null },
      newPhoneNumber: { type: String, default: null },
    },
    provider:{
      type:String,
      enum:Object.values(providerEnum),
      default:providerEnum.LOCAL
    },
    googleSup:{
        type:String,
        default:null  
    },
    profilePic:{
      secure_url:String,
      public_id:String

    }
  },

  { timestamps: true, 
    toJSON:{
      virtuals:true
    },
    toObject:{
      virtuals:true
    }

  }
);
userSchema.virtual("Messages",{
  ref:"Messages",
  localField:"_id",
  foreignField:"receiverdId"
})
const User = mongoose.model("User", userSchema);
export default User;
