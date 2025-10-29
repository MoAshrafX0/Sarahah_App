import User from "../../../DB/Models/user.model.js";
import { asyncDecrypt, asyncEncrypt } from "../../../utils/encryption.util.js";
import { compareSync, hashSync } from "bcrypt";
import { customAlphabet } from "nanoid";
import { emitter } from "../../../Utils/sendemail.util.js";
import { v4 as uuidv4 } from "uuid";
import BlackListTokens from "../../../DB/Models/blacl-listed-tokens.model.js";
import { genrateToken, verfaiyToken } from "../../../Utils/genrateToken.util.js";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";
import { providerEnum } from "../../../common/enums/user.enum.js";
const uniqString = customAlphabet("1234567890abcdef", 5);
// create user
export const siginUp = async (req, res) => {
  const {
    firstName,
    lastName,
    age,
    gender,
    email,
    password,
    role,
    phoneNumber,
  } = req.body;
  const isEmailExist = await User.findOne({
    $or: [{ email }, { firstName, lastName }],
  });
  if (isEmailExist) {
    return res.status(409).json({ message: "Email or Name already exists" });
  }
  const otp = uniqString();
  const hashPassword = hashSync(password, 10);
  const encryptedPhoneNumber = asyncEncrypt(phoneNumber);
  const user = await User.create({
    firstName,
    lastName,
    age,
    gender,
    email,
    password: hashPassword,
    role,
    phoneNumber: encryptedPhoneNumber,
    otps: { confirmation: hashSync(otp, 10) },
  });
  //send email to user
  emitter.emit("sendEmail", {
    to: user.email,
    subject: "Welcome to Saraha",
    contant: `<h1>Welcome to Saraha</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>Thank you for signing up to Saraha. We are excited to have you on board!</p>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>Please use this code to verify your email address and complete your registration.</p>
      <p>If you did not sign up for Saraha, please ignore this email.</p>
      <p>Best regards,</p>
      <p>The Saraha Team</p>
      `,
  });
  res.status(201).json({ message: "User created successfully", user });
};
//login user
export const login = async (req, res) => {
  const { email, password } = req.body;


  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isPasswordMatch = compareSync(password, user.password);

  if (!isPasswordMatch) {
    return res.status(405).json({ message: "Invalid email or password" });
  }
  // access token generation
  if (!user.isconfirmed) {
    return res.status(403).json({ message: "Please confirm your email" });
  }

  const accessToken = genrateToken(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
      jwtid: uuidv4(),
    }
  );
  //Refres Token Genration
  const refreshToken = genrateToken(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET_REFRASH_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN_REFRESH,
      jwtid: uuidv4(),
    }
  );
  res.status(200).json({
    message: "User logged in successfully",
    accessToken,
    refreshToken,
  });
};
// =============================> confirm user email <====================================
export const confirmEmail = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, isconfirmed: false });
  if (!user) {
    return res.status(404).json({ message: "User not found or Confirmed" });
  }

  const isOtpMatch = compareSync(otp, user.otps.confirmation);
  if (!isOtpMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  user.isconfirmed = true;
  user.otps.confirmation = null;
  await user.save();
  res.status(200).json({ message: "Email confirmed successfully", user });
};


// =============================> black list Tokens  <====================================
export const logout = async (req, res) => {
  const {
    token: { tokenId, expirationdate },
    user: { id },
  } = req.loggedInUesr;

  const blackLitedToken = await BlackListTokens.create({
    tokenId,
    expirationDate: new Date(expirationdate * 1000),
    userId: id,
  });
  res.status(200).json({ message: "User logged out successfuly  " });
};

// =============================> Refresh Token <====================================
export const refreshTokenService = async (req, res) => {
  const { refreshtoken } = req.headers;
  const decodedData = verfaiyToken(
    refreshtoken,
    process.env.JWT_SECRET_REFRASH_KEY
  );
  const accesstoken = genrateToken(
    { id: decodedData.id, email: decodedData.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
      jwtid: uuidv4(),
    }
  );
  res
    .status(200)
    .json({ message: "User Token is  Refreshed successfully  ", accesstoken });
};

//  =============================> sigin up With google <====================================
export const siginUpWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, given_name, family_name, email_verified, sub } =
    ticket.payload;
  if (!email_verified) {
    return res.status(401).json({ message: "User not verified" });
  }
  const isUserExist = await User.findOne({
    googleSup: sub,
    provider: providerEnum.GOOGLE,
  });
  let newUser;
  if (!isUserExist) {
    newUser = await User.create({
      firstName: given_name,
      lastName: family_name,
      email,
      provider: providerEnum.GOOGLE,
      isconfirmed: true,
      password: hashSync(uniqString(), 10),
      googleSup: sub,
    });
  } else {
    newUser = isUserExist;
    isUserExist.email = email;
    isUserExist.firstName = given_name;
    isUserExist.lastName = family_name || "";
    await isUserExist.save();
  }

  const accessToken = genrateToken(
    { id: newUser._id, role: newUser.role, email: newUser.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
      jwtid: uuidv4(),
    }
  );
  //Refres Token Genration
  const refreshToken = genrateToken(
    {
      id: newUser._id,
      role: newUser.role,
      email: newUser.email,
    },
    process.env.JWT_SECRET_REFRASH_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN_REFRESH,
      jwtid: uuidv4(),
    }
  );

  res.status(200).json({
    message: "User signed up successfully",
    tokens: { accessToken, refreshToken },
  });
};

