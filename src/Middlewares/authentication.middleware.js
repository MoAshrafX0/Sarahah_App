  // ============================> authentication.middleware <====================================

import jwt from "jsonwebtoken";
import BlackListTokens from "../DB/Models/blacl-listed-tokens.model.js";
import User from "../DB/Models/user.model.js";
import { verfaiyToken } from "../Utils/genrateToken.util.js";

export const authentiactionMiddleware = async (req, res, next) => {
  const { accesstoken } = req.headers;
  if (!accesstoken)
    return res.status(401).json({ message: "Please Provide an Access Token" });
  //verfaiy token
  const decoded = verfaiyToken(accesstoken, process.env.JWT_SECRET);
  if (!decoded.jti) {
    return res.status(401).json({ message: "Invail Token" });
  }

  // check if token in BlackList
  const blackListtoken = await BlackListTokens.findOne({
    tokenId: decoded.jti,
  });
  if (blackListtoken) {
    return res.status(401).json({ message: "this token is blackListed" });
  }
  // get user from db
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(404).json({ message: "User not Found" });
  }

  req.loggedInUesr = {
    user , 
    token: { tokenId: decoded.jti, expirationdate: decoded.exp },
  };
  console.log(user);
  
  next();
};
