import mongoose from "mongoose";
// ============================> blackListTokenschema <====================================
export const blackListTokenschema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const BlackListTokens=mongoose.model("لآlackListTokens" , blackListTokenschema)
export default BlackListTokens