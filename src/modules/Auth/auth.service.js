import User from "../../DB/models/user.model.js";
import asyncHandler from "express-async-handler";
import Randomstring from "randomstring";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/token/token.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import { eventEmitter } from "../../utils/email/emailEvent.js";
import OTP from "../../DB/models/otp.model.js";
import { subjects } from "../../utils/email/sendEmail.js";

//* @desc    Register a new user
export const register = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const otp = Randomstring.generate({ length: 6, charset: "alphanumeric" });
  await OTP.create({ email, otp });

  const user = await User.create({
    ...req.body,

    password: hash({ plainText: req.body.password }),
  });

  await eventEmitter.emit("sendEmail", {
    email,
    otp,
    subject: subjects.REGISTER,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

//* @desc    Login user and return JWT token
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new Error("Invalid email or password", { cause: 400 }));
  }

  const isMatch = compareHash({
    plainText: password,
    hash: user.password,
  });

  if (!isMatch) {
    return next(new Error("Invalid email or password", { cause: 400 }));
  }

  if (!user.isEmailVerified) {
    return next(
      new Error("Please verify your email before logging in", { cause: 400 }),
    );
  }

  user.isLoggedIn = true;
  user.lastLoginAt = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    accessToken: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    }),
    refreshToken: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
    }),
  });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  const { id, email } = jwt.verify(refreshToken, process.env.JWT_SECRET);

  const user = await User.findById(id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const newAccessToken = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  });

  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

//* @desc    Verify email OTP
export const verifyEmailOTP = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;

  const otpExists = await OTP.findOne({ otp });

  if (!otpExists) {
    return next(new Error("Invalid OTP", { cause: 400 }));
  }

  const user = await User.findOne({ email: otpExists.email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  user.isEmailVerified = true;
  await user.save();
  await OTP.deleteMany({ email: user.email });

  res.status(200).json({
    success: true,
    message: "Email verified successfully, Try to login now",
  });
});

//* @desc    Send OTP

export const sendOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const otp = Randomstring.generate({ length: 6, charset: "alphanumeric" });
  await OTP.deleteMany({ email });

  const savedOTP = await OTP.create({ email, otp });

  await eventEmitter.emit("sendEmail", {
    email,
    otp,
    subject: subjects.VERIFY_EMAIL,
  });

  res.status(200).json({
    success: true,
    message: "OTP sent to email successfully",
    data: {
      email: savedOTP.email,
      otp: savedOTP.otp,
      createdAt: savedOTP.createdAt,
    },
  });
});

//* @desc    Forgot password

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email, isEmailVerified: true });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const otp = Randomstring.generate({ length: 6, charset: "alphanumeric" });
  await OTP.deleteMany({ email });
  const savedOTP = await OTP.create({ email, otp });

  await eventEmitter.emit("sendEmail", {
    email,
    otp,
    subject: subjects.FORGOT_PASSWORD,
  });
  res.status(200).json({
    success: true,
    message: "OTP sent to email successfully",
    data: {
      email: savedOTP.email,
      otp: savedOTP.otp,
      createdAt: savedOTP.createdAt,
    },
  });
});

//* @desc    Reset password

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { otp, email, newPassword } = req.body;

  const user = await User.findOne({ email, isEmailVerified: true });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const otpExists = await OTP.findOne({ email, otp });
  if (!otpExists) {
    return next(new Error("Invalid OTP", { cause: 400 }));
  }

  user.password = hash({ plainText: newPassword });
  await user.save();
  await OTP.deleteMany({ email });

  res.status(200).json({
    success: true,
    message: "Password reset successfully, Try to login now",
  });
});
